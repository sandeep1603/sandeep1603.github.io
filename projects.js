/*
  Project data. script.js renders one tile per entry, in this order, and opens the full case study in a dialog.
  To add a project, copy an entry and edit it. Fields:
    title, context, summary         short texts shown on the tile
    status                          optional badge, e.g. "In progress"
    tint                            tile colour: 1 blue, 2 green, 3 yellow, 4 lilac
    problem, result, next           texts (next is optional); "approach" may be a text or a list of texts
    stack                           list of tools
    links                           optional list of { label, href }, or { label } with no link
    figure                          optional { svg, caption }: inline SVG, also used as the tile picture
    log                             optional example text shown under the figure (synthetic data only)
  Anything written as [VERIFY: ...] is highlighted on the page until you remove it.
*/
window.PROJECTS = [
  {
    title: "Graph VAE for resting-state fMRI",
    context: "M.Sc. thesis, TU Dresden, 2024",
    tint: 1,
    summary: "Resting-state fMRI mapped onto a brain-surface graph, then embedded with a Graph Variational Autoencoder and GraphSAGE to see what the latent space captures.",
    problem: "ICA and PCA, the usual tools for fMRI, cannot handle non-linear structure, and a standard VAE treats the brain as a 3D box even though the cortex is folded. The aim was to learn latent features of resting-state fMRI while keeping the brain's surface geometry.",
    approach: [
      "Projected resting-state fMRI from the Human Connectome Project (1,200 time points) onto a cortical icosphere: its 10,242 vertices became graph nodes, with edges taken from the surface mesh.",
      "Trained a Graph Variational Autoencoder with GCN encoder and decoder, and GraphSAGE for comparison, with a 16-dimensional latent space over 1,000 epochs.",
      "Compared full-graph training with NeighborLoader and subgraph batching.",
      "Inspected the latent space with UMAP, t-SNE and functional-connectivity matrices, against ICA and PCA as baselines."
    ],
    result: "Both models reconstructed the signal well: test MSE of 0.009 for the GVAE with NeighborLoader, 0.0094 for GraphSAGE and 0.032 for the full-graph GVAE. The latent space did not form clear clusters linked to brain anatomy or function, which the thesis puts down to the low variability of resting-state data and to over-smoothing. Subgraph batching ran out of memory.",
    stack: ["Python", "PyTorch", "PyTorch Geometric", "PyTorch Lightning", "NetworkX", "Nilearn", "UMAP", "t-SNE"],
    next: "Use task-based or naturalistic fMRI, which varies more than resting state; reduce over-smoothing in GraphSAGE; try a hybrid of the two models; and use the icosphere for multi-scale graph learning.",
    links: [
      { label: "Thesis (PDF)", href: "https://github.com/sandeep1603/TU_Master_Thesis/blob/master/Sandeep__Raj_Sagaya_Raj_4914836.pdf" },
      { label: "Code on GitHub", href: "https://github.com/sandeep1603/TU_Master_Thesis" }
    ],
    figure: {
      caption: "Schematic of the thesis models. Illustrative, synthetic data.",
      svg: `<svg viewBox="0 0 560 230" role="img" aria-labelledby="f1t f1d">
<title id="f1t">Graph VAE schematic</title>
<desc id="f1d">A cortical surface graph with 10,242 nodes goes through a GCN encoder into a 16-dimensional latent space. A GCN decoder reconstructs the signal, and the latent space is inspected with UMAP and t-SNE.</desc>
<defs><marker id="a1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="fg-head"/></marker></defs>
<g class="fg-edge"><path d="M24 70L62 44M24 70L54 108M62 44L96 78M54 108L96 78M96 78L74 136M24 70L74 136"/></g>
<g class="fg-node"><circle cx="24" cy="70" r="7"/><circle cx="62" cy="44" r="7"/><circle cx="54" cy="108" r="7"/><circle cx="96" cy="78" r="7"/><circle cx="74" cy="136" r="7"/></g>
<text x="60" y="168" class="fg-t fg-c fg-s">Cortical surface</text>
<text x="60" y="184" class="fg-t fg-c fg-s">graph, 10,242 nodes</text>
<path d="M114 90H138" class="fg-arrow" marker-end="url(#a1)"/>
<rect x="142" y="64" width="104" height="52" rx="10" class="fg-box"/>
<text x="194" y="95" class="fg-t fg-c">GCN encoder</text>
<path d="M246 90H270" class="fg-arrow" marker-end="url(#a1)"/>
<rect x="274" y="56" width="104" height="68" rx="10" class="fg-box fg-acc"/>
<text x="326" y="84" class="fg-t fg-c">Latent z</text>
<text x="326" y="104" class="fg-t fg-c fg-s">16-d, N(μ, σ²)</text>
<path d="M378 90H402" class="fg-arrow" marker-end="url(#a1)"/>
<rect x="406" y="64" width="80" height="52" rx="10" class="fg-box"/>
<text x="446" y="88" class="fg-t fg-c fg-s">GCN</text>
<text x="446" y="104" class="fg-t fg-c fg-s">decoder</text>
<path d="M486 90H502" class="fg-arrow" marker-end="url(#a1)"/>
<text x="530" y="86" class="fg-t fg-c fg-s">Recon-</text>
<text x="530" y="102" class="fg-t fg-c fg-s">structed</text>
<text x="530" y="118" class="fg-t fg-c fg-s">signal</text>
<path d="M326 124V164" class="fg-arrow" marker-end="url(#a1)"/>
<rect x="256" y="168" width="140" height="44" rx="10" class="fg-box"/>
<text x="326" y="195" class="fg-t fg-c">UMAP / t-SNE</text>
</svg>`
    }
  },
  {
    title: "Bayesian deforestation detection",
    context: "Andean Options",
    status: "In progress",
    tint: 2,
    summary: "A five-module pipeline on Sentinel-2 time series that gives a probability of deforestation per parcel, not just yes or no, as evidence for EU Deforestation Regulation compliance.",
    problem: "Evidence for the EU Deforestation Regulation needs more than a yes/no flag. For each parcel the pipeline should say how likely deforestation is, based on satellite time series, so the uncertainty is visible to whoever reviews the evidence.",
    approach: [
      "Ingestion: Sentinel-2 time series through openEO.",
      "Baseline modelling.",
      "Masking.",
      "Likelihood model, giving probabilities instead of a binary label.",
      "Report output.",
      "Region-specific configurations for Bolivia and Venezuela."
    ],
    result: "Work in progress. The likelihood model is still being calibrated, so there are no validated results yet. It is not a trained or deployed model.",
    stack: ["Python", "openEO", "rasterio", "Sentinel-2"],
    next: "Finish calibrating the likelihood model, and check its probabilities against field results before they are used as evidence.",
    figure: {
      caption: "The five modules of the pipeline. Illustrative, synthetic data.",
      svg: `<svg viewBox="0 0 470 196" role="img" aria-labelledby="f2t f2d">
<title id="f2t">Five-module Bayesian pipeline</title>
<desc id="f2d">Module 1 ingestion through openEO, module 2 baseline modelling, module 3 masking, module 4 likelihood model which is still being calibrated, module 5 report output. Region configurations for Bolivia and Venezuela apply to all modules.</desc>
<defs><marker id="a2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="fg-head"/></marker></defs>
<rect x="8" y="16" width="130" height="58" rx="10" class="fg-box"/>
<text x="73" y="40" class="fg-t fg-c">1 Ingestion</text>
<text x="73" y="60" class="fg-t fg-c fg-s">Sentinel-2, openEO</text>
<path d="M138 45H164" class="fg-arrow" marker-end="url(#a2)"/>
<rect x="168" y="16" width="130" height="58" rx="10" class="fg-box"/>
<text x="233" y="50" class="fg-t fg-c">2 Baseline</text>
<path d="M298 45H324" class="fg-arrow" marker-end="url(#a2)"/>
<rect x="328" y="16" width="130" height="58" rx="10" class="fg-box"/>
<text x="393" y="50" class="fg-t fg-c">3 Masking</text>
<path d="M393 74V112" class="fg-arrow" marker-end="url(#a2)"/>
<rect x="328" y="116" width="130" height="58" rx="10" class="fg-box fg-acc"/>
<text x="393" y="140" class="fg-t fg-c">4 Likelihood</text>
<text x="393" y="160" class="fg-t fg-c fg-s">being calibrated</text>
<path d="M328 145H302" class="fg-arrow" marker-end="url(#a2)"/>
<rect x="168" y="116" width="130" height="58" rx="10" class="fg-box"/>
<text x="233" y="140" class="fg-t fg-c">5 Report</text>
<text x="233" y="160" class="fg-t fg-c fg-s">P(deforestation)</text>
<rect x="8" y="116" width="130" height="58" rx="10" class="fg-box fg-dash"/>
<text x="73" y="140" class="fg-t fg-c fg-s">Region configs</text>
<text x="73" y="160" class="fg-t fg-c fg-s">Bolivia, Venezuela</text>
</svg>`
    }
  },
  {
    title: "Auditable evidence pipeline",
    context: "Andean Options",
    tint: 3,
    summary: "Per-parcel PDF and JSON dossiers built from satellite and forest datasets, where every result can be traced back to its source.",
    problem: "Each parcel needs a dossier of evidence drawn from many data sources, and every result in it has to be traceable to the source that produced it.",
    approach: [
      "Automated collection from satellite and forest datasets for each parcel polygon through one REST API, with dataset IDs and versions checked against the live catalogue instead of copied from documentation.",
      "An audit log written on every run.",
      "A test suite of more than 400 tests. Known bugs are kept as tests that are expected to fail, so they stay visible until they are fixed.",
      "A regression set of 17 test parcels, run end to end through the service API.",
      "Parcel coordinates extracted from photos with OpenCV and OCR."
    ],
    result: "Per-parcel PDF and JSON dossiers with an audit trail. All 17 test parcels run through the service API in under a minute.",
    stack: ["Python", "REST APIs", "GeoJSON", "pyproj", "pytest", "Docker", "OpenCV", "OCR"],
    next: "Calibrate the screening thresholds, which are first estimates from the literature, against field results once they are available.",
    figure: {
      caption: "Pipeline architecture, and an example audit-log entry. Illustrative, synthetic data: the identifiers, values and sources are made up.",
      svg: `<svg viewBox="0 0 520 220" role="img" aria-labelledby="f3t f3d">
<title id="f3t">Evidence pipeline architecture</title>
<desc id="f3d">A parcel polygon and a set of satellite and forest datasets feed a collection step, then validation, then a PDF and JSON dossier. Collection and validation both write to an audit log, which is referenced in the dossier.</desc>
<defs><marker id="a3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="fg-head"/></marker></defs>
<rect x="134" y="4" width="96" height="40" rx="10" class="fg-box"/>
<text x="182" y="21" class="fg-t fg-c fg-s">Parcel polygon</text>
<text x="182" y="37" class="fg-t fg-c fg-s">(OCR from photo)</text>
<path d="M182 44V68" class="fg-arrow" marker-end="url(#a3)"/>
<rect x="14" y="80" width="92" height="50" rx="10" class="fg-box"/>
<rect x="10" y="76" width="92" height="50" rx="10" class="fg-box"/>
<rect x="6" y="72" width="92" height="50" rx="10" class="fg-box"/>
<text x="52" y="93" class="fg-t fg-c fg-s">Satellite and</text>
<text x="52" y="109" class="fg-t fg-c fg-s">forest datasets</text>
<path d="M106 97H130" class="fg-arrow" marker-end="url(#a3)"/>
<rect x="134" y="72" width="96" height="50" rx="10" class="fg-box"/>
<text x="182" y="102" class="fg-t fg-c">Collection</text>
<path d="M230 97H256" class="fg-arrow" marker-end="url(#a3)"/>
<rect x="260" y="72" width="96" height="50" rx="10" class="fg-box"/>
<text x="308" y="102" class="fg-t fg-c">Validation</text>
<path d="M356 97H382" class="fg-arrow" marker-end="url(#a3)"/>
<rect x="386" y="72" width="128" height="50" rx="10" class="fg-box fg-acc"/>
<text x="450" y="93" class="fg-t fg-c">Dossier</text>
<text x="450" y="111" class="fg-t fg-c fg-s">PDF + JSON</text>
<path d="M182 122V160M308 122V160" class="fg-arrow fg-dashline" marker-end="url(#a3)"/>
<rect x="134" y="164" width="222" height="44" rx="10" class="fg-box fg-dash"/>
<text x="245" y="191" class="fg-t fg-c">Audit log, every run</text>
<path d="M356 186H450V126" class="fg-arrow fg-dashline" marker-end="url(#a3)"/>
</svg>`
    },
    log: `{
  "run_id": "demo-run-0001",
  "parcel_id": "EXAMPLE-PARCEL-01",
  "geometry": "synthetic polygon, not a real parcel",
  "source": "example_dataset_A",
  "dataset_version": "v0.0-example",
  "status": "ok",
  "note": "illustrative, synthetic data"
}`
  },
  {
    title: "Skin segmentation with synthetic data",
    context: "Team project, TU Dresden, 2022",
    tint: 4,
    summary: "Precise skin detection in facial video recordings with a U-Net trained on synthetic data, then optimised for inference speed.",
    problem: "Precise skin detection in facial video recordings.",
    approach: [
      "Deep-learning segmentation with a U-Net trained with synthetic data, then fine-tuned for accuracy on real video data.",
      "Optimised inference speed with TensorRT and ONNX Runtime."
    ],
    result: "A U-Net that segments skin in real facial video after training on synthetic data, with inference sped up through TensorRT and ONNX Runtime.",
    stack: ["Python", "PyTorch", "TensorRT", "ONNX Runtime"],
    figure: {
      caption: "Schematic of a U-Net (generic). Illustrative, synthetic data.",
      svg: `<svg viewBox="0 0 460 200" role="img" aria-labelledby="f4t f4d">
<title id="f4t">U-Net schematic</title>
<desc id="f4d">A video frame enters an encoder that narrows in three steps to a bottleneck, then a decoder widens in three steps to a skin mask. Skip connections link encoder and decoder steps of the same size.</desc>
<defs><marker id="a4" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="fg-head"/></marker></defs>
<text x="40" y="174" class="fg-t fg-c fg-s">Video frame</text>
<rect x="24" y="34" width="32" height="120" rx="6" class="fg-box"/>
<rect x="90" y="54" width="32" height="90" rx="6" class="fg-box"/>
<rect x="156" y="74" width="32" height="60" rx="6" class="fg-box"/>
<rect x="214" y="92" width="32" height="34" rx="6" class="fg-box fg-acc"/>
<rect x="272" y="74" width="32" height="60" rx="6" class="fg-box"/>
<rect x="338" y="54" width="32" height="90" rx="6" class="fg-box"/>
<text x="420" y="174" class="fg-t fg-c fg-s">Skin mask</text>
<rect x="404" y="34" width="32" height="120" rx="6" class="fg-box fg-acc"/>
<path d="M56 140L86 136M122 130L152 126M188 120L210 116M246 116L268 120M304 126L334 130M370 136L400 140" class="fg-arrow" marker-end="url(#a4)"/>
<path d="M40 34C40 4 420 4 420 30M106 54C106 28 354 28 354 50M172 74C172 54 288 54 288 70" class="fg-arrow fg-dashline" marker-end="url(#a4)"/>
<text x="230" y="194" class="fg-t fg-c fg-s">Encoder, bottleneck, decoder, with skip connections</text>
</svg>`
    }
  }
];
