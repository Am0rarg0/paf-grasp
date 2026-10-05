# PAF-Grasp research project page

A responsive, buildless academic website inspired by the presentation style of Proxy2World. All research content is grounded in the supplied manuscript. The supplied introduction is optimized for web playback.

## Preview

Serve the `dist` folder with any static HTTP server. For example, from this directory:

```powershell
python -m http.server 8765 --directory dist
```

## Edit

- `dist/index.html`: title, authors, narrative, paper links, citation.
- `dist/style.css`: typography, colors, responsive layout.
- `dist/experiments.css`: section 03 video gallery and apparatus overview.
- `dist/hammer.css` and `dist/hammer.js`: robot-mounted target and hammer contact animation.
- `dist/app.js`: experiment video playback and enlargement, results charts, illustrative hammer-to-target animation controls.
- `dist/assets/`: manuscript, optimized introduction, extracted manuscript figures.

The code resource is labeled pending until a repository URL is supplied. The citation intentionally identifies the paper as a manuscript and makes no claim about acceptance. Section 03 uses representative video panels cropped from the supplied introduction, plus the experimental apparatus image from the supplied CoRL_2026.zip. The catching clip depicts ball catching; success rates remain tied to the manuscript evaluation, not the selected illustrative clips. The hammer-to-target animation is a schematic SVG illustration, not experimental data. The robot shoulder, elbow, and wrist rotate to move the target to the interception point before hammer contact, while the base remains fixed. It supports play, pause, replay, progress scrubbing, and reduced-motion preferences.

## GitHub Pages

The contents of `dist` can be hosted directly on GitHub Pages without a build step. For a repository-root deployment, copy the contents of `dist` to that root and enable Pages for the desired branch. All asset URLs are relative, so repository subpaths work.

## Research provenance

- Title, authors, affiliations, abstract: supplied manuscript page 1.
- Architecture: original `pdfs/main.pdf` in the supplied CoRL_2026.zip, displayed as a sharp PDF render with an enlarged image view.
- Real-world success rates: manuscript Figure 3; 50 trials per method per task.
- Simulation comparison: manuscript Table 1, with π₀ as strongest reactive baseline by average success.
- Future-representation comparison: manuscript Table 2; input differences are disclosed on the page.
- Scope and limits: manuscript Section 5 and Section 4.3.

Visual reference: https://dumdumgura.github.io/proxy2world/
