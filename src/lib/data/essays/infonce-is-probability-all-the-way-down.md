---
title: InfoNCE is Probability All The Way Down
date: June 2026
published: true
---

There is a version of the contrastive learning story where you take two augmented views of the same image, push their representations together, push representations of different images apart, train on enough GPUs, get good features. This version is not wrong. It just skips the part that makes it interesting.

Contrastive learning is the natural consequence of asking a very old question. How do we bring a model distribution close to a data distribution? Then following the mathematics honestly until the computation becomes intractable, and asking how to escape the intractability. Every piece of the modern contrastive objective, the positive pairs, the temperature, the denominator that grows with batch size, the reason more negatives help, falls out of this derivation without any additional assumptions. The loss function is not designed, but derived.

I aim to start from the basics and derieve every step towards InfoNCE. We start from the existence of a data distribution and end at the NT-Xent loss of SimCLR[^1] and the InfoNCE bound of CPC[^2]. The goal. isto show that contrastive learning is probability all the way down.

## The Distribution We Cannot Write Down

Every observed data point (image, text caption, autio) is a realization of a random variable. We assume all such realizations are drawn from a single fixed distribution $p_{\text{data}}$ over the input space $\mathcal{X} \subseteq \mathbb{R}^d$:

$$\mathbf{x} \sim p_{\text{data}}(\mathbf{x}).$$

We will never write $p_{\text{data}}$ in closed form, and we cannot. It encodes every regularity in the natural world that produced the data and we only have a finite collection of samples $\mathcal{D} = \{\mathbf{x}^{(1)}, \ldots, \mathbf{x}^{(m)}\}$ drawn from it. These samples define the empirical distribution, which places a point mass of $1/m$ at each observed point:

$$\hat{p}_{\text{data}}(\mathbf{x}) = \frac{1}{m} \sum_{i=1}^{m} \delta(\mathbf{x} - \mathbf{x}^{(i)}),$$

where $\delta$ is the Dirac delta. The empirical distribution is a crude approximation of $p_{\text{data}}$. It assigns zero probability to every point not in $\mathcal{D}$, even though the true distribution almost certainly has support far beyond those points. The entire purpose of machine learning is to use $\hat{p}_{\text{data}}$ to learn something useful about the structure of $p_{\text{data}}$.

Before we can speak of learning, we need the concept of expectation or the average value of a function under a distribution. For any measurable $g : \mathcal{X} \to \mathbb{R}$:

$$\mathbb{E}_{\mathbf{x} \sim p_{\text{data}}}[g(\mathbf{x})] = \int_{\mathcal{X}} g(\mathbf{x}) \, p_{\text{data}}(\mathbf{x}) \, d\mathbf{x}.$$

We, ofcourse, cannot evaluate this because $p_{\text{data}}$ is unknown. But the law of large numbers guarantees that if the samples in $\mathcal{D}$ are drawn independently from the same distribution, the sample average converges almost surely to the true expectation as $m \to \infty$:

$$\frac{1}{m} \sum_{i=1}^m g(\mathbf{x}^{(i)}) \xrightarrow{\text{a.s.}} \mathbb{E}_{\mathbf{x} \sim p_{\text{data}}}[g(\mathbf{x})].$$

This convergence makes the empirical distribution useful. But it requires the samples to be independent and identically distributed (IID). Identically distributed, i.e. each $\mathbf{x}^{(i)} \sim p_{\text{data}}$. Independent, i.e. the joint distribution factorizes. So, the probability of observing this particular dataset, under $p_{\text{data}}$​, is the product of the individual probabilities

$$p(\mathbf{x}^{(1)}, \ldots, \mathbf{x}^{(m)}) = \prod_{i=1}^{m} p_{\text{data}}(\mathbf{x}^{(i)}).$$

The independence condition transforms the log-likelihood of an entire dataset into a sum. Without it, $\log p(\mathcal{D};\theta)$ would be a single intractable expression coupling every data point to every other. With it, the probability of observing this same dataset, but now evaluated under the model $p_{\text{model}}(\cdot;\theta)$ rather than under $p_{\text{data}}$ becomes

$$\log p(\mathcal{D};\theta) = \sum_{i=1}^m \log p_{\text{model}}(\mathbf{x}^{(i)};\theta),$$

Where each term depends only on a single example. Stochastic gradient descent is justified precisely because this sum means each term is an unbiased estimate of the full gradient. The IID assumption is not a probabilistic nicety, it is what makes learning with large datasets tractable.

## Measuring the Distance Between Distributions

We have a model $p_{\text{model}}(\mathbf{x};\theta)$ and a target $p_{\text{data}}(\mathbf{x})$. We want the model to be close to the data distribution. To evalutate this, we must arrive at a mathematical approach to measure closeness between two distributions, which will require a brief detour through information theory. For a discrete random variable $X$ with distribution $P$, the Shannon entropy is[^3]:

$$H(P) = -\sum_x P(x) \log P(x) = -\mathbb{E}_{x \sim P}[\log P(x)].$$

Entropy measures the average uncertainty of the distribution, i.e. how surprised we are, on average, when we observe a sample. A distribution concentrated at a single point has $H = 0$: no uncertainty - this can be quickly assessed by substituting $P(x) = 1$ into $H(P)$. A uniform distribution over $n$ outcomes has $H = \log n$: maximum uncertainty. For continuous distributions we write the differential entropy:

_Note: The negative sign exists because $\log P(x)$ is always negative or zero. Probabilities are between 0 and 1, and $\log$ of any number in $(0, 1]$ is $\leq 0$. So without the negative sign, entropy would always be negative or zero, which wouldbe a strange convention for something we want to interpret as a positive measure of 
uncertainty._

$$h(p) = -\int p(\mathbf{x}) \log p(\mathbf{x}) \, d\mathbf{x},$$

which can be negative but satisfies the same intuitions. The logarithm base determines the units — base 2 gives bits, base $e$ gives nats. We use nats throughout.

Now suppose the true distribution generating messages is $p$, but we design an encoding scheme optimized for a different distribution $q$, i.e. our assumption of $p_{\text{data}}$. A code optimized for $q$ assigns a codeword of length $-\log q(x)$ bits to outcome $x$. Common outcomes under $q$ get short codewords, rare ones get long codewords. But the messages are actually drawn from $p$, not $q$. So the average code length we actually pay is not determined by $q$ alone — it is the code lengths $-\log q(x)$ weighted by how often each outcome $x$ actually occurs, which is $p(x)$:

$$H(p, q) = -\sum_x \underbrace{p(x)}_{\text{freq. of } x} \cdot \underbrace{(-\log q(x))}_{\text{code length}} \cdot (-1) = -\sum_x p(x) \log q(x)$$

When $q = p$, the code is perfectly matched to reality and $H(p, q) = H(p)$, the minimum possible average code length. Any mismatch between $q$ and $p$ forces us to use more bits than necessary. The excess is the KL divergence $D_{\text{KL}}(p \| q) = H(p, q) - H(p) \geq 0$.[^4]

$$D_{\text{KL}}(p \| q) = H(p, q) - H(p) = \mathbb{E}_{x \sim p}\left[\log \frac{p(x)}{q(x)}\right].$$

The KL divergence is always non-negative, with equality if and only if $p = q$ almost everywhere. This follows from Jensen's inequality: for any concave function $\phi$, $\mathbb{E}[\phi(Y)] \leq \phi(\mathbb{E}[Y])$. Since $\log$ is concave:

$$-D_{\text{KL}}(p \| q) = \mathbb{E}_{x \sim p}\left[\log \frac{q(x)}{p(x)}\right] \leq \log \underbrace{\mathbb{E}_{x \sim p}\left[\frac{q(x)}{p(x)}\right]}_{= \int q(x) \, dx = 1} = 0.$$

So $D_{\text{KL}}(p \| q) \geq 0$, with equality iff $p = q$. Jensen's inequality is a one-line proof of a fundamental fact, and it will return several more times in this derivation.

The KL divergence is asymmetric: $D_{\text{KL}}(p \| q) \neq D_{\text{KL}}(q \| p)$ in general. It is not a metric. But it is the natural measure of the information lost when we approximate $p$ with $q$, and that is exactly what we care about.

## Maximum Likelihood as KL Minimization

We want to minimize $D_{\text{KL}}(p_{\text{data}} \| p_{\text{model}})$ over $\theta$. Expanding:

$$D_{\text{KL}}(p_{\text{data}} \| p_{\text{model}}) = \underbrace{-\mathbb{E}_{\mathbf{x} \sim p_{\text{data}}}[\log p_{\text{data}}(\mathbf{x})]}_{H(p_{\text{data}}),\ \text{constant in } \theta} - \mathbb{E}_{\mathbf{x} \sim p_{\text{data}}}[\log p_{\text{model}}(\mathbf{x};\theta)].$$

The entropy of $p_{\text{data}}$ does not depend on $\theta$. Minimizing $D_{\text{KL}}$ over $\theta$ is therefore identical to maximizing:

$$\mathbb{E}_{\mathbf{x} \sim p_{\text{data}}}[\log p_{\text{model}}(\mathbf{x};\theta)].$$

This is maximum likelihood estimation (MLE). The identity MLE $\Leftrightarrow$ $\min D_{\text{KL}}(p_{\text{data}} \| p_{\text{model}})$ is exact, not approximate. Every cross-entropy loss in machine learning is a KL divergence in disguise, with the entropy of the data distribution as an additive constant that disappears in the gradient.

Since $p_{\text{data}}$ is unknown, we replace the expectation with its Monte Carlo estimate under the empirical distribution, justified by the law of large numbers under IID:

$$\hat{\theta} = \arg\max_\theta \frac{1}{m} \sum_{i=1}^m \log p_{\text{model}}(\mathbf{x}^{(i)};\theta).$$

This is equivalently the minimization of the negative log-likelihood (NLL):

$$\mathcal{L}_{\text{NLL}}(\theta) = -\frac{1}{m} \sum_{i=1}^m \log p_{\text{model}}(\mathbf{x}^{(i)};\theta) = \mathbb{E}_{\mathbf{x} \sim \hat{p}_{\text{data}}}[-\log p_{\text{model}}(\mathbf{x};\theta)].$$

Written this way, the NLL is recognizable as the empirical risk i.e. the average loss over the dataset under the loss function $\ell(\mathbf{x};\theta) = -\log p_{\text{model}}(\mathbf{x};\theta)$. Empirical risk minimization (ERM) is the general framework: choose any loss $\ell$ and minimize its empirical average,

$$\hat{\theta}_{\text{ERM}} = \arg\min_\theta \frac{1}{m} \sum_{i=1}^m \ell(\mathbf{x}^{(i)};\theta) = \arg\min_\theta \mathbb{E}_{\mathbf{x} \sim \hat{p}_{\text{data}}}[\ell(\mathbf{x};\theta)],$$

with the goal of making the empirical risk approximate the population risk $\mathbb{E}_{\mathbf{x} \sim p_{\text{data}}}[\ell(\mathbf{x};\theta)]$. MLE is the special case $\ell = -\log p_{\text{model}}$. The gap between empirical and population risk or the generalization error is controlled by the complexity of the function class and the size of the dataset, which is the subject of statistical learning theory[^5].

## The Latent Structure of $p_{\text{data}}$

Consider what it means to sample a random image from the internet. You do not get a uniformly random arrangement of pixels; you get a cat, or a ship, or a face. The vast majority of pixel space is garbage that never appears in natural data. The distribution $p_{\text{data}}$ concentrates its mass in a small number of semantically coherent regions, and those regions are organized by an underlying concept that we never directly observe.

This hidden concept is the latent variable $c$. Think of the data as being generated by a two-step process: first, nature picks a class — "cat", "ship", "face" — according to some prior probability $P(c)$. Then, given that class, nature generates a specific image according to $p(\mathbf{x} \mid c)$. The image $\mathbf{x}$ is what we see. The class $c$ is what we do not. Summing this process over all possible classes gives the mixture:

$$p_{\text{data}}(\mathbf{x}) = \sum_{c=1}^C P(c) \, p(\mathbf{x} \mid c).$$

The data distribution is a weighted average of within-class distributions, with the weights being how common each class is. We observe samples from this mixture, which means we observe $\mathbf{x}$ with $c$ summed out and forgotten. The joint distribution $p(\mathbf{x}, c) = P(c) \, p(\mathbf{x} \mid c)$ is the object that knows both. It assigns probability to every possible (image, class) pair. Summing out $c$ recovers the marginal we actually sample from:

$$p(\mathbf{x}) = \sum_c p(\mathbf{x}, c) = \sum_c p(\mathbf{x} \mid c) \, P(c).$$

Dividing the joint by the marginal of the conditioning variable recovers any conditional. The distribution over images given class $c$ is:

$$p(\mathbf{x} \mid c) = \frac{p(\mathbf{x}, c)}{P(c)},$$

where $P(c)$ rescales the joint into a proper distribution that integrates to 1 over $\mathbf{x}$. Now the key move: the joint factors in two equally valid ways:

$$p(\mathbf{x}, c) = \underbrace{p(\mathbf{x} \mid c) \, P(c)}_{\text{generate } c \text{ first, then } \mathbf{x}} = \underbrace{P(c \mid \mathbf{x}) \, p(\mathbf{x})}_{\text{generate } \mathbf{x} \text{ first, then } c}.$$

Setting these equal and solving for $P(c \mid \mathbf{x})$ gives Bayes' theorem:

$$\underbrace{P(c \mid \mathbf{x})}_{\text{posterior}} = \frac{\overbrace{p(\mathbf{x} \mid c)}^{\text{likelihood}} \; \overbrace{P(c)}^{\text{prior}}}{\underbrace{\sum_{c'} p(\mathbf{x} \mid c') \, P(c')}_{\text{normalizer}}}.$$

It answers: given that I observed image $\mathbf{x}$, how likely is it that the class was $c$? The answer is proportional to how likely $\mathbf{x}$ was under class $c$, weighted by how common class $c$ is, normalized so everything sums to 1. The posterior $P(c \mid \mathbf{x})$ is exactly what a supervised classifier learns — given an image, what class does it belong to? But in self-supervised learning we never observe $c$, so we cannot train on this target directly. What we can do is exploit the structure of the joint $p(\mathbf{x}, c)$ without labels — and to see how, we need to understand what information $\mathbf{x}$ and $c$ actually share.

## Mutual Information

The mutual information between $\mathbf{x}$ and $c$ measures how much knowing one reduces uncertainty about the other. It is defined as the KL divergence between the joint distribution and the product of the marginals:

$$I(\mathbf{x}; c) = D_{\text{KL}}(p(\mathbf{x}, c) \| p(\mathbf{x}) P(c)) = \mathbb{E}_{(\mathbf{x}, c) \sim p(\mathbf{x}, c)}\left[\log \frac{p(\mathbf{x}, c)}{p(\mathbf{x}) P(c)}\right].$$

If $\mathbf{x}$ and $c$ are independent, $p(\mathbf{x}, c) = p(\mathbf{x}) P(c)$ and the KL divergence is zero: $I(\mathbf{x}; c) = 0$. Non-zero mutual information means the joint carries more information than the product of marginals — knowing $c$ tells you something about $\mathbf{x}$, and vice versa. Since KL is non-negative, $I(\mathbf{x}; c) \geq 0$ always.

Expanding using the conditional:

$$I(\mathbf{x}; c) = \mathbb{E}_{(\mathbf{x}, c)}\left[\log \frac{p(\mathbf{x} \mid c)}{p(\mathbf{x})}\right] = \mathbb{E}_{(\mathbf{x}, c)}\left[\log \frac{P(c \mid \mathbf{x})}{P(c)}\right],$$

where the second equality uses Bayes' theorem: $p(\mathbf{x} \mid c)/p(\mathbf{x}) = P(c \mid \mathbf{x})/P(c)$. The quantity inside the expectation is the pointwise mutual information (PMI):

$$\text{PMI}(\mathbf{x}, c) = \log \frac{p(\mathbf{x}, c)}{p(\mathbf{x}) P(c)} = \log \frac{p(\mathbf{x} \mid c)}{p(\mathbf{x})} = \log \frac{P(c \mid \mathbf{x})}{P(c)}.$$

The PMI at a specific pair $(\mathbf{x}, c)$ tells us how much more likely this co-occurrence is than if $\mathbf{x}$ and $c$ were independent. High PMI means this pair appears together far more often than chance would predict. Mutual information is the average PMI over the joint distribution.

We can also decompose mutual information in terms of entropy. Using the chain rules $p(\mathbf{x}, c) = p(\mathbf{x} \mid c) P(c)$ and $p(\mathbf{x}) P(c) = p(\mathbf{x}) P(c)$:

$$I(\mathbf{x}; c) = \mathbb{E}_{(\mathbf{x},c)}[\log p(\mathbf{x} \mid c)] - \mathbb{E}_{(\mathbf{x},c)}[\log p(\mathbf{x})] = -H(\mathbf{x} \mid c) + H(\mathbf{x}) = H(\mathbf{x}) - H(\mathbf{x} \mid c).$$

Mutual information is the reduction in entropy about $\mathbf{x}$ when $c$ is known. Equivalently, by symmetry, $I(\mathbf{x}; c) = H(c) - H(c \mid \mathbf{x})$. These two decompositions give the same value — mutual information is symmetric: $I(\mathbf{x}; c) = I(c; \mathbf{x})$.

The reason we care about mutual information in the context of self-supervised learning is now becoming visible. The latent class $c$ that we never observe is the thing that defines semantic similarity. Two images of the same cat have high PMI with the same class. A cat and a ship have low PMI with each other's classes. A representation that captures $I(\mathbf{x}; c)$ has learned to encode semantic content. The question is how to maximize $I(\mathbf{x}; c)$ without ever observing $c$. The answer involves replacing $c$ with something observable — a second view — and a crucial density ratio.

## The Wall: Intractable Partition Functions

Before we arrive at contrastive objectives, we must understand why the direct approach fails. Suppose we try to model $p_{\text{data}}$ explicitly with an energy-based model (EBM)[^6]. We define an energy function $E_\theta : \mathcal{X} \to \mathbb{R}$ and write the unnormalized density:

$$\tilde{p}_\theta(\mathbf{x}) = \exp(-E_\theta(\mathbf{x})).$$

This is non-negative everywhere. To obtain a proper probability distribution, we must divide by the partition function:

$$Z(\theta) = \int_{\mathcal{X}} \exp(-E_\theta(\mathbf{x})) \, d\mathbf{x}, \qquad p_\theta(\mathbf{x}) = \frac{\exp(-E_\theta(\mathbf{x}))}{Z(\theta)}.$$

The name "partition function" comes from statistical physics, where $Z$ sums over all microstates of a system[^7]. The log-likelihood of a data point is:

$$\log p_\theta(\mathbf{x}) = -E_\theta(\mathbf{x}) - \log Z(\theta).$$

The gradient with respect to $\theta$ is:

$$\nabla_\theta \log p_\theta(\mathbf{x}) = -\nabla_\theta E_\theta(\mathbf{x}) - \nabla_\theta \log Z(\theta).$$

The first term is easy. The second is not. By Leibniz's integral rule:

$$\nabla_\theta \log Z(\theta) = \frac{1}{Z(\theta)} \int \nabla_\theta \exp(-E_\theta(\mathbf{x})) \, d\mathbf{x} = -\frac{1}{Z(\theta)} \int \nabla_\theta E_\theta(\mathbf{x}) \exp(-E_\theta(\mathbf{x})) \, d\mathbf{x},$$

which simplifies to:

$$\nabla_\theta \log Z(\theta) = -\mathbb{E}_{\mathbf{x} \sim p_\theta}[\nabla_\theta E_\theta(\mathbf{x})].$$

The gradient of the log partition function is an expectation under the *model distribution* $p_\theta$. To compute it, we need samples from $p_\theta$ — the model we are currently trying to train. This is circular. In practice, MCMC methods like Contrastive Divergence[^8] approximate this expectation by running a Markov chain for a few steps from each data point, but in high dimensions these chains mix poorly and the estimates are biased.

For images in $\mathbb{R}^{H \times W \times 3}$, the integral defining $Z(\theta)$ runs over an astronomically large space. There is no analytical solution and no practical numerical approximation. This is the wall that direct maximum likelihood hits when the model is expressive enough to be interesting.

There are several paths around it. Each corresponds to a different family of modern self-supervised methods.

---

## First Escape: Variational Bounds and Latent Variables

One path replaces the intractable marginal $p_\theta(\mathbf{x}) = \int p_\theta(\mathbf{x} \mid \mathbf{z}) p(\mathbf{z}) \, d\mathbf{z}$ with a tractable lower bound. Introduce a latent variable $\mathbf{z}$ with prior $p(\mathbf{z})$ and a generative model $p_\theta(\mathbf{x} \mid \mathbf{z})$. The log-likelihood of a data point is:

$$\log p_\theta(\mathbf{x}) = \log \int p_\theta(\mathbf{x} \mid \mathbf{z}) \, p(\mathbf{z}) \, d\mathbf{z}.$$

Introduce a variational posterior $q_\phi(\mathbf{z} \mid \mathbf{x})$ — a parametric approximation to the true posterior $p_\theta(\mathbf{z} \mid \mathbf{x})$. Multiply and divide inside the log by $q_\phi(\mathbf{z} \mid \mathbf{x})$:

$$\log p_\theta(\mathbf{x}) = \log \mathbb{E}_{\mathbf{z} \sim q_\phi(\cdot \mid \mathbf{x})}\left[\frac{p_\theta(\mathbf{x} \mid \mathbf{z}) \, p(\mathbf{z})}{q_\phi(\mathbf{z} \mid \mathbf{x})}\right].$$

Apply Jensen's inequality ($\log$ is concave, so $\log \mathbb{E}[Y] \geq \mathbb{E}[\log Y]$):

$$\log p_\theta(\mathbf{x}) \geq \mathbb{E}_{\mathbf{z} \sim q_\phi(\cdot \mid \mathbf{x})}\left[\log \frac{p_\theta(\mathbf{x} \mid \mathbf{z}) \, p(\mathbf{z})}{q_\phi(\mathbf{z} \mid \mathbf{x})}\right] = \mathbb{E}_{q_\phi}[\log p_\theta(\mathbf{x} \mid \mathbf{z})] - D_{\text{KL}}(q_\phi(\mathbf{z} \mid \mathbf{x}) \| p(\mathbf{z})).$$

This is the Evidence Lower BOund (ELBO)[^9]:

$$\log p_\theta(\mathbf{x}) \geq \underbrace{\mathbb{E}_{q_\phi}[\log p_\theta(\mathbf{x} \mid \mathbf{z})]}_{\text{reconstruction}} - \underbrace{D_{\text{KL}}(q_\phi(\mathbf{z} \mid \mathbf{x}) \| p(\mathbf{z}))}_{\text{regularization}} \;=:\; \mathcal{L}_{\text{ELBO}}(\theta, \phi; \mathbf{x}).$$

The gap between the log-likelihood and the ELBO is exactly $D_{\text{KL}}(q_\phi(\mathbf{z} \mid \mathbf{x}) \| p_\theta(\mathbf{z} \mid \mathbf{x})) \geq 0$. Maximizing the ELBO over $(\theta, \phi)$ simultaneously pushes the likelihood up and drives the variational posterior toward the true posterior.

The reconstruction term $\mathbb{E}_{q_\phi}[\log p_\theta(\mathbf{x} \mid \mathbf{z})]$ is a denoising objective in disguise. If we choose $q_\phi(\mathbf{z} \mid \mathbf{x})$ to be a fixed corruption process — add Gaussian noise, mask patches, drop tokens — then we are asking the decoder $p_\theta(\mathbf{x} \mid \mathbf{z})$ to reconstruct the original $\mathbf{x}$ from a corrupted version $\mathbf{z}$. This is exactly the objective of denoising autoencoders[^10], masked autoencoders (MAE)[^11], and BERT[^12]. These methods are not heuristics. They are approximations to variational inference under specific choices of corruption process.

---

## Second Escape: Noise-Contrastive Estimation

The variational approach requires a latent variable structure. A different escape from the partition function wall works for any unnormalized model. Noise-Contrastive Estimation (NCE) (Gutmann & Hyvärinen, 2010)[^13] converts density estimation into binary classification.

Introduce a known, tractable noise distribution $q(\mathbf{x})$ — for example, a uniform distribution or a Gaussian. Mix the data and noise in ratio $1:k$: for every data point, draw $k$ noise samples. Define a binary label $D \in \{0, 1\}$ with $D = 1$ if a sample came from $p_{\text{data}}$ and $D = 0$ if it came from $q$. The prior on $D$ is:

$$P(D=1) = \frac{1}{1+k}, \qquad P(D=0) = \frac{k}{1+k}.$$

The marginal density of an observed sample $\mathbf{x}$ in this mixture is:

$$p(\mathbf{x}) = \frac{1}{1+k} p_{\text{data}}(\mathbf{x}) + \frac{k}{1+k} q(\mathbf{x}).$$

By Bayes' theorem, the posterior probability that $\mathbf{x}$ came from the data — not the noise — is:

$$P(D=1 \mid \mathbf{x}) = \frac{\frac{1}{1+k} p_{\text{data}}(\mathbf{x})}{\frac{1}{1+k} p_{\text{data}}(\mathbf{x}) + \frac{k}{1+k} q(\mathbf{x})} = \frac{p_{\text{data}}(\mathbf{x})}{p_{\text{data}}(\mathbf{x}) + k \, q(\mathbf{x})}.$$

We now replace $p_{\text{data}}$ with our parametric model $p_\theta(\mathbf{x}) = \tilde{p}_\theta(\mathbf{x}) \cdot e^c$, where $c = -\log Z(\theta)$ is a free scalar parameter to be learned alongside $\theta$. The classifier output becomes:

$$h_{\theta, c}(\mathbf{x}) = \frac{\tilde{p}_\theta(\mathbf{x}) e^c}{\tilde{p}_\theta(\mathbf{x}) e^c + k \, q(\mathbf{x})},$$

and we train this classifier by minimizing the binary cross-entropy against the true labels $D$:

$$\mathcal{L}_{\text{NCE}}(\theta, c) = -\mathbb{E}_{\mathbf{x} \sim p_{\text{data}}}[\log h_{\theta,c}(\mathbf{x})] - k \, \mathbb{E}_{\mathbf{y} \sim q}[\log(1 - h_{\theta,c}(\mathbf{y}))].$$

Gutmann & Hyvärinen proved that as $m \to \infty$, the minimizer $(\hat\theta, \hat c)$ satisfies $\tilde{p}_{\hat\theta}(\mathbf{x}) e^{\hat c} \to p_{\text{data}}(\mathbf{x})$. The partition function $Z(\theta) = e^{-\hat c}$ is estimated by gradient descent alongside the energy parameters, without ever computing the integral. The intractable normalizer has been turned into a free parameter learned through the classification objective.

This is a beautiful idea. The partition function is what makes the normalization constraint hard — but from the perspective of the classifier, it is just a scalar that shifts all the scores uniformly. Let the optimizer find it.

---

## From NCE to Contrastive Self-Supervised Learning

NCE draws negatives from a fixed noise distribution $q$. The step to modern self-supervised learning replaces the fixed $q$ with the empirical data distribution $\hat{p}_{\text{data}}$, and replaces binary "real vs noise" classification with multiclass "which sample is the true positive" classification.

Here is the setup. We have an anchor $\mathbf{x}$ and a context $\mathbf{c}$ — in the image domain, $\mathbf{c}$ could be a second augmented view of the same image; in the temporal domain, it could be a past segment of a sequence. The pair $(\mathbf{x}, \mathbf{c})$ is drawn from a joint distribution $p(\mathbf{x}, \mathbf{c})$ that has positive mutual information $I(\mathbf{x}; \mathbf{c}) > 0$. We also draw $N-1$ negative samples $\tilde{\mathbf{x}}_1, \ldots, \tilde{\mathbf{x}}_{N-1}$ independently from the marginal $p(\mathbf{x})$, forming a set $X = \{x_1, \ldots, x_N\}$ where one element (at position $d^\star$, uniform over $\{1, \ldots, N\}$) is the true positive $\mathbf{x}$ and the rest are negatives.

A scorer $f_\theta(\mathbf{x}_k, \mathbf{c})$ assigns a score to each candidate. We build a classifier over positions:

$$P(d^\star = i \mid X, \mathbf{c}) = \frac{f_\theta(\mathbf{x}_i, \mathbf{c})}{\sum_{k=1}^N f_\theta(\mathbf{x}_k, \mathbf{c})}.$$

What is the optimal $f_\theta$? The true posterior over positions is, by Bayes' theorem — with the uniform prior $P(d^\star = i) = 1/N$ for all $i$ canceling — proportional to the likelihood of observing $\mathbf{x}_i$ in position $i$ given that position $i$ is the positive:

$$P(d^\star = i \mid X, \mathbf{c}) = \frac{p(\mathbf{x}_i \mid \mathbf{c}) \prod_{k \neq i} p(\mathbf{x}_k)}{\sum_{j=1}^N p(\mathbf{x}_j \mid \mathbf{c}) \prod_{k \neq j} p(\mathbf{x}_k)} = \frac{p(\mathbf{x}_i \mid \mathbf{c}) / p(\mathbf{x}_i)}{\sum_{j=1}^N p(\mathbf{x}_j \mid \mathbf{c}) / p(\mathbf{x}_j)}.$$

The optimal score function is therefore:

$$f_\theta^\star(\mathbf{x}, \mathbf{c}) = \frac{p(\mathbf{x} \mid \mathbf{c})}{p(\mathbf{x})} = \exp(\text{PMI}(\mathbf{x}, \mathbf{c})).$$

The optimal scorer is the exponentiated pointwise mutual information — the same density ratio that appeared in the mutual information decomposition, and the same object that Bayes' theorem says is the posterior-to-prior ratio $P(c \mid \mathbf{x}) / P(c)$. We parametrize the critic as $f_\theta(\mathbf{x}, \mathbf{c}) = \exp(g_\theta(\mathbf{x}, \mathbf{c}))$ and train it to correctly identify the positive by minimizing the cross-entropy of the $N$-way classification:

$$\mathcal{L}_{\text{InfoNCE}} = -\mathbb{E}\left[\log \frac{\exp(g_\theta(\mathbf{x}, \mathbf{c}))}{\sum_{k=1}^N \exp(g_\theta(\mathbf{x}_k, \mathbf{c}))}\right].$$

This is the InfoNCE loss of van den Oord et al. (2018)[^2]. The denominator $\sum_{k=1}^N \exp(g_\theta(\mathbf{x}_k, \mathbf{c}))$ is a Monte Carlo approximation of the partition function $Z_\theta(\mathbf{c}) = \int \exp(g_\theta(\mathbf{x}', \mathbf{c})) \, p(\mathbf{x}') \, d\mathbf{x}'$, evaluated with $N$ samples from $\hat{p}_{\text{data}}$. The intractable integral that killed direct maximum likelihood has been replaced by a finite sum over the batch.

---

## The Mutual Information Bound

Van den Oord et al. showed that minimizing the InfoNCE loss maximizes a lower bound on the mutual information $I(\mathbf{x}; \mathbf{c})$. The bound is:

$$I(\mathbf{x}; \mathbf{c}) \geq \log N - \mathcal{L}_{\text{InfoNCE}}.$$

The proof is short and the mechanism is illuminating. At the optimal $f^\star(\mathbf{x}, \mathbf{c}) = p(\mathbf{x} \mid \mathbf{c}) / p(\mathbf{x})$, the optimal loss value is:

$$\mathcal{L}_{\text{InfoNCE}}^\star = -\mathbb{E}\left[\log \frac{p(\mathbf{x} \mid \mathbf{c}) / p(\mathbf{x})}{\frac{1}{N}\sum_{k=1}^N p(\mathbf{x}_k \mid \mathbf{c}) / p(\mathbf{x}_k)} \right] - \log N.$$

Focusing on the argument of the outer expectation, note that $\frac{1}{N}\sum_{k=1}^N p(\mathbf{x}_k \mid \mathbf{c}) / p(\mathbf{x}_k)$ is an empirical average of the density ratio over $N$ samples from $p(\mathbf{x})$. By the law of large numbers, $\frac{1}{N}\sum_{k=1}^N p(\mathbf{x}_k \mid \mathbf{c}) / p(\mathbf{x}_k) \to \mathbb{E}_{\mathbf{x} \sim p(\mathbf{x})}[p(\mathbf{x} \mid \mathbf{c}) / p(\mathbf{x})] = \int p(\mathbf{x} \mid \mathbf{c}) \, d\mathbf{x} = 1$. So for large $N$, the denominator concentrates around 1, and:

$$\mathcal{L}_{\text{InfoNCE}}^\star \approx -\mathbb{E}\left[\log \frac{p(\mathbf{x} \mid \mathbf{c})}{p(\mathbf{x})}\right] - \log N = -I(\mathbf{x}; \mathbf{c}) - \log N.$$

More precisely, by Jensen's inequality applied to the concave $\log$:

$$-\mathcal{L}_{\text{InfoNCE}}^\star = \mathbb{E}\left[\log \frac{p(\mathbf{x} \mid \mathbf{c}) / p(\mathbf{x})}{\frac{1}{N}\sum_{k=1}^N p(\mathbf{x}_k \mid \mathbf{c}) / p(\mathbf{x}_k)}\right] + \log N \leq \mathbb{E}\left[\log \frac{p(\mathbf{x} \mid \mathbf{c})}{p(\mathbf{x})}\right] + \log N = I(\mathbf{x};\mathbf{c}) + \log N,$$

giving $\mathcal{L}_{\text{InfoNCE}}^\star \geq -I(\mathbf{x};\mathbf{c}) - \log N$, or equivalently $I(\mathbf{x};\mathbf{c}) \geq \log N - \mathcal{L}_{\text{InfoNCE}}$.

The bound tightens as $N$ grows. With $N = 1$, the bound gives $I \geq 0$, which is trivially true and useless. With $N \to \infty$, the Monte Carlo estimate of the partition function converges to its true value, the classifier approaches the optimal Bayes classifier, and the bound approaches $I(\mathbf{x};\mathbf{c})$ from below. Every additional negative is one more sample in the partition function approximation, tightening both the statistical estimate and the MI bound simultaneously. This is why more negatives improve contrastive representations: it is not a heuristic. It is a direct consequence of the Monte Carlo approximation getting more accurate.

---

## The NT-Xent Loss of SimCLR

In SimCLR[^1], the critic takes the specific form:

$$g_\theta(\mathbf{x}, \mathbf{c}) = \frac{f_\theta(\mathbf{x})^\top f_\theta(\mathbf{c})}{\|f_\theta(\mathbf{x})\| \|f_\theta(\mathbf{c})\| \cdot \tau} = \frac{\text{sim}(\mathbf{z}, \mathbf{z}^+)}{\tau},$$

where $\mathbf{z} = f_\theta(\mathbf{x})$ is the projected representation, $\text{sim}$ is cosine similarity, and $\tau > 0$ is a temperature parameter. A batch of $N$ images produces $2N$ augmented views — two augmentations per image — and both views of image $i$ serve as positives for each other, while all $2(N-1)$ other views are negatives. The NT-Xent loss (Normalized Temperature-scaled Cross Entropy) for a positive pair $(i, j)$ is:

$$\ell_{i,j} = -\log \frac{\exp(\text{sim}(\mathbf{z}_i, \mathbf{z}_j)/\tau)}{\sum_{k=1}^{2N} \mathbb{1}_{[k \neq i]} \exp(\text{sim}(\mathbf{z}_i, \mathbf{z}_k)/\tau)},$$

and the total loss is the average over all positive pairs: $\mathcal{L} = \frac{1}{2N}\sum_{i=1}^{2N}(\ell_{i,j(i)} + \ell_{j(i),i})$ where $j(i)$ is the index of the second view of image $i$.

The denominator is a sum over $2N - 1$ exponentials. At SimCLR's default batch size of 4096, this is $2 \times 4096 - 1 = 8191$ terms per anchor — 8191 Monte Carlo samples of the partition function $Z_i(\theta) = \int \exp(\text{sim}(f_\theta(\mathbf{x}'), \mathbf{z}_i)/\tau) \, p_{\text{data}}(\mathbf{x}') \, d\mathbf{x}'$. This is why SimCLR needs large batches — it is not a memory issue or a stability issue. It is that the quality of the partition function approximation, and therefore the tightness of the mutual information bound, grows with the number of negatives.

MoCo[^14] addresses this by maintaining a momentum-updated queue of $K = 65536$ embeddings from previous batches. The queue decouples the size of the partition function approximation from the memory cost of the current mini-batch. The key encoder is updated by exponential moving average of the query encoder weights, $\theta_k \leftarrow m \theta_k + (1-m)\theta_q$ with $m = 0.999$, which keeps the queue embeddings approximately consistent with the current encoder without requiring backpropagation through the key branch.

The temperature $\tau$ controls the sharpness of the distribution over negatives. Small $\tau$ concentrates probability mass on the hardest negatives — the ones with the highest cosine similarity to the anchor — and pushes them apart aggressively. Large $\tau$ spreads probability more uniformly. Wang & Liu (2021)[^15] showed that the gradient of the InfoNCE loss has the form of a weighted sum where the weights on each negative are proportional to $e^{(\text{sim}(\mathbf{z}_i, \mathbf{z}_k)/\tau)}$, confirming that the loss implicitly focuses on hard negatives without requiring explicit mining — a property that Tian (2022)[^16] connected to the general theory of contrastive losses as minimizers of a family $\mathcal{L}_{\phi,\psi}$ parameterized by monotone functions.

---

## The Full Chain

We began by assuming data is drawn IID from an unknown $p_{\text{data}}$ — IID being required so that the dataset log-likelihood decomposes into a sum and gradient descent is tractable. We defined expectation and invoked the law of large numbers to justify approximating population expectations with empirical averages. We introduced entropy as average uncertainty, derived cross-entropy as the cost of mismatched encoding, and showed that KL divergence is their difference — so that minimizing KL is identical to minimizing cross-entropy, which is identical to maximum likelihood, which in practice is empirical risk minimization over the NLL. We recognized that $p_{\text{data}}$ has mixture structure over a latent class $c$, introduced conditional probability as the joint divided by the marginalizer, and derived Bayes' theorem as the consequence of writing the joint two ways. We defined mutual information as the KL divergence between joint and product-of-marginals, identified the PMI as the per-sample quantity whose expectation gives MI, and showed via Bayes' theorem that the PMI equals the log posterior-to-prior ratio $\log P(c \mid \mathbf{x}) / P(c)$ — the thing a classifier learns.

We then hit the wall: direct maximum likelihood on an unnormalized model requires computing $\nabla_\theta \log Z(\theta) = -\mathbb{E}_{p_\theta}[\nabla_\theta E_\theta(\mathbf{x})]$, an expectation under the model, which is intractable in high dimensions. The variational escape introduces a latent variable and bounds the log-likelihood from below using Jensen's inequality, turning the problem into optimizing the ELBO — which is a reconstruction term plus a KL regularizer, and corresponds to denoising objectives. The NCE escape introduces a noise distribution and converts normalization into binary classification using Bayes' theorem, letting the partition function be a free parameter learned by the optimizer. Replacing the fixed noise distribution with in-batch negatives and the binary classification with an $N$-way classification gives InfoNCE, whose denominator is a finite Monte Carlo approximation of the partition function, and whose gap from the true MI bound shrinks as $N$ grows, by the law of large numbers applied to the importance weights.

It is probability all the way down.

---

[^1]: Chen, T., Kornblith, S., Norouzi, M., & Hinton, G. (2020). [A Simple Framework for Contrastive Learning of Visual Representations](https://arxiv.org/abs/2002.05709). *ICML 2020*.

[^2]: van den Oord, A., Li, Y., & Vinyals, O. (2018). [Representation Learning with Contrastive Predictive Coding](https://arxiv.org/abs/1807.03748). *arXiv:1807.03748*.

[^3]: Shannon, C. E. (1948). [A Mathematical Theory of Communication](https://people.math.harvard.edu/~ctm/home/text/others/shannon/entropy/entropy.pdf). *Bell System Technical Journal, 27*(3), 379–423.

[^4]: Kullback, S., & Leibler, R. A. (1951). [On information and sufficiency](https://www.jstor.org/stable/2236703). *Annals of Mathematical Statistics, 22*(1), 79–86.

[^5]: Vapnik, V. N. (1998). *Statistical Learning Theory*. Wiley-Interscience.

[^6]: LeCun, Y., Chopra, S., Hadsell, R., Ranzato, M., & Huang, F. J. (2006). [A tutorial on energy-based learning](http://yann.lecun.com/exdb/publis/pdf/lecun-06.pdf). In *Predicting Structured Data*, MIT Press.

[^7]: Goodfellow, I., Bengio, Y., & Courville, A. (2016). *Deep Learning*, Chapter 18: Confronting the Partition Function. MIT Press. [deeplearningbook.org](https://www.deeplearningbook.org/contents/partition.html).

[^8]: Hinton, G. E. (2002). [Training products of experts by minimizing contrastive divergence](https://www.cs.toronto.edu/~hinton/absps/tr00-004.pdf). *Neural Computation, 14*(8), 1771–1800.

[^9]: Kingma, D. P., & Welling, M. (2013). [Auto-Encoding Variational Bayes](https://arxiv.org/abs/1312.6114). *ICLR 2014*.

[^10]: Vincent, P., Larochelle, H., Lajoie, I., Bengio, Y., & Manzagol, P.-A. (2010). [Stacked Denoising Autoencoders](https://www.jmlr.org/papers/v11/vincent10a.html). *JMLR, 11*, 3371–3408.

[^11]: He, K., Chen, X., Xie, S., Li, Y., Dollár, P., & Girshick, R. (2022). [Masked Autoencoders Are Scalable Vision Learners](https://arxiv.org/abs/2111.06377). *CVPR 2022*.

[^12]: Devlin, J., Chang, M.-W., Lee, K., & Toutanova, K. (2019). [BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding](https://arxiv.org/abs/1810.04805). *NAACL 2019*.

[^13]: Gutmann, M., & Hyvärinen, A. (2010). [Noise-Contrastive Estimation: A New Estimation Principle for Unnormalized Statistical Models](https://proceedings.mlr.press/v9/gutmann10a.html). *AISTATS 2010*.

[^14]: He, K., Fan, H., Wu, Y., Xie, S., & Girshick, R. (2020). [Momentum Contrast for Unsupervised Visual Representation Learning](https://arxiv.org/abs/1911.05722). *CVPR 2020*.

[^15]: Wang, T., & Isola, P. (2020). [Understanding Contrastive Representation Learning through Alignment and Uniformity on the Hypersphere](https://arxiv.org/abs/2005.10242). *ICML 2020*.

[^16]: Tian, Y. (2022). [Understanding Deep Contrastive Learning via Coordinate-Wise Optimization](https://arxiv.org/abs/2201.12680). *NeurIPS 2022*.