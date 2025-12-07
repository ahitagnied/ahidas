---
title: Taste Is a Loss Function
date: August 2025
---

I like video models and I like art. Recently, these two things have been converging in a way that makes me uneasy.[^1]

Video models are getting good. Not just at coherence but at composition, pacing, and knowing where to put the camera and when to cut. They're starting to make aesthetic choices that feel intentional. And that means they're developing taste. But whose taste are they learning? And how can we ensure they learn the right kind?

Taste is usually treated as a matter of sensibility. It's what critics have and machines don't. But the gap between sensibility and computation is narrower than it seems. Every time anyone chooses one work over another, they're performing a comparison. Every comparison implies an ordering. An ordering is a mapping from the space of possible works to a scalar value. That mapping is a function. And if a function exists, it can, in principle, be approximated.[^2]

## Not Just Ranking

The tempting simplification is to think of taste as just another ranking problem. Train on enough positive and negative pairs, push the good stuff up and the bad stuff down, done. But this misses something important: taste isn't monolithic. It's an entangled bundle of constraints and values, some of which can be quantified cleanly and some of which remain stubbornly opaque.

Taste operates in layers. _Structural taste_ concerns correctness: a symphony resolving in key, a building obeying basic geometry, a scene maintaining lighting continuity. _Aesthetic taste_ concerns balance, proportion, rhythm, texture.[^3] _Contextual taste_ concerns meaning: whether a work resonates with a particular cultural moment, plays with or against a genre's conventions, or fits the voice of a specific creator.

When people judge, they blend these without noticing. A painting that violates proportion might still resonate because of its emotional impact. A perfectly lit photograph might leave viewers cold because it feels hollow. Machines, by contrast, must be told exactly how to resolve such conflicts. And that act of weighting, deciding whether coherence is more important than originality, or if beauty should trump fidelity, isn't a technical parameter. It's a declaration of values.

## The Formula

Formally, this could be written as:

$$T(x) = α · S_{semantic}(x) + β · S_{aesthetic}(x) − γ · P_{incoherence}(x)$$

Here, α, β, and γ are priorities. Increasing α is to say: accuracy first. Increasing β says: beauty matters more than literal fit. Decreasing γ says: we can live with a little chaos if the rest sings. Every tweak to these weights shifts the output space and thus shifts the kind of world the system constructs.

Once T(x) is defined, it can be turned into a loss function:

$$L_{taste} = max(0, m − (T(x^{+}) − T(x^{−})))$$

where x⁺ is the preferred work, x⁻ the less preferred, and m is a margin enforcing that preferred works score significantly higher. This is the easy part: pairwise ranking is old ground. The hard part is building T(x) so that it isn't brittle.

Human taste is adaptive. It reacts to novelty, to context, to change. A static function risks collapsing into self-parody, optimizing toward a frozen aesthetic until every output feels like a variation on the same theme. People can revise their taste in response to new work. A machine will only do so if the definition of taste itself is dynamic.

## The Overfitting Problem

And this leads to a deeper problem: if you can formalize taste, you can also optimize for it. This makes it vulnerable to overfitting. Just as models trained on benchmarks can "game" the metric without genuine improvement, systems can learn to mimic the superficial signals of taste without capturing its deeper logic.

Think of the "Instagram look": high-contrast, shallow depth of field, that specific aesthetic. This didn't emerge because it's inherently better. It emerged because the algorithms rewarded it. The platform's engagement metrics created a feedback loop. Certain aesthetics got more likes, so people posted more of that style, so the algorithm learned to promote it, so it became "good taste." A taste function, once public and measurable, invites exploitation.

And this concern grows more urgent with video models. As they get better at understanding what makes a frame work, what makes a cut land, what makes a sequence feel _right_, they'll optimize for whatever taste function they've learned. If that function is too narrow, we'll end up with aesthetic convergence. Everything starts to look the same. The TikTok house aesthetic, but for every video ever made.

## The Absence Isn't Neutral

But the absence of an explicit taste function isn't neutral either. When we don't define it, models still learn taste, from the training corpus. That taste isn't the collective wisdom of humanity. It's the statistical median of what was easiest to scrape. The result isn't wrong, but it's bland. It's taste without tension, stripped of the extremes that make human curation interesting.

Models trained on aggregated internet data learn a kind of averaged-out aesthetic. Not offensive, not challenging, not particularly memorable. Safe. And when these models start producing content at scale, they'll reproduce that safety. The weird stuff, the boundary-pushing stuff, the things that only appeal to a narrow slice of people but appeal to them _intensely_, all of that gets smoothed away in the training process.

## The Feedback Loop

There's another dimension to this that feels particularly pressing: taste evolves in response to what we see. If models optimize for current taste, then produce content based on that optimization, human taste will adapt to that aesthetic. Then the models train on the new data, learn the shifted taste, and the cycle continues.

We're already seeing this with image models. Certain visual styles, the "Midjourney look," the "DALL-E aesthetic," are becoming recognizable and then influencing human taste.[^4] People start to prefer compositions that look like what the models make, because that's what they're seeing constantly. The feedback loop is already running.

For video, this will be more intense. Video is temporal, narrative, emotionally engaging in ways static images aren't. When video models get good enough to be used at scale, for ads, for content, for everything, they won't just reflect taste. They'll shape it. And they'll do it fast.

## The Real Questions

So the question isn't just _can_ we formalize taste. It's _should_ we, and under what rules. Whose taste will it encode? Will it update over time, and if so, who decides the updates? Do we want a single shared taste function, or a multitude, competing, coexisting like critics in a city?

The technical problem of approximating taste is solvable. But the societal problem of deciding which tastes to scale, which aesthetics to amplify through the machinery of optimization, that's not a problem you can close with better architecture or more data.

And we need to be deliberate about this. Because taste isn't an inexpressible mystery. It's a messy, multidimensional, value-laden signal. But it's a signal. If we can define it, we can measure it. If we can measure it, we can optimize for it. And if we can optimize for it, we can shape the aesthetic of everything the machine touches.

That power feels too important to treat as an afterthought. As video models get better at understanding what makes a frame work, what makes a cut land, what makes a sequence feel _right_, we need to decide whose taste they're learning. Because they will learn taste from somewhere. The only question is whether we're paying attention when they do.

---

[^1]: [How "House of David" Used Runway to Become Amazon's Latest Hit Series](https://runwayml.com/customers/how-house-of-david-used-runway-to-become-amazons-latest-hit-series)

[^2]: Iigaya, K. et al. (2023). [Neural mechanisms underlying the hierarchical construction of perceived aesthetic value](https://www.nature.com/articles/s41467-022-35654-y). Nature Communications, 14(1).

[^3]: Redies, C. (2015). [Combining universal beauty and cultural context in a unifying model of visual aesthetic experience](https://www.frontiersin.org/journals/human-neuroscience/articles/10.3389/fnhum.2015.00218/full). Frontiers in Human Neuroscience, 9:218.

[^4]: Epstein, Z. et al. (2023). [Art and the science of generative AI](https://www.science.org/doi/10.1126/science.adh4451). Science, 380(6650), 1110-1111.
