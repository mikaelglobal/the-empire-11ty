module.exports = function(eleventyConfig) {
  // ── PASSTHROUGH COPIES ──
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy("src/assets/js");
  eleventyConfig.addPassthroughCopy("src/assets/css");
  eleventyConfig.addPassthroughCopy("src/assets/fonts");
  eleventyConfig.addPassthroughCopy("src/assets/mk_logo.png");

  // ── COLLECTIONS ──
  // Blog posts collection (kept for backward compatibility, but no longer used)
  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/posts/*.md").sort((a, b) => {
      return b.date - a.date;
    });
  });

  // ── INSIGHTS COLLECTION ──
  // Reads from src/insights/*.md
  eleventyConfig.addCollection("insights", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/insights/*.md").sort((a, b) => {
      return b.date - a.date;
    });
  });

  // ── CASE STUDIES COLLECTION ──
  eleventyConfig.addCollection("caseStudies", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/case-studies/*.md").sort((a, b) => {
      return (b.data.year || 0) - (a.data.year || 0);
    });
  });


// ── FILTERS ──
eleventyConfig.addFilter("formatDate", function(date) {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
});

eleventyConfig.addFilter("limit", function(arr, limit) {
  return arr.slice(0, limit);
});

// ── NEW: WhatsApp URL filter ──
eleventyConfig.addFilter("whatsapp", function(phone) {
  // Remove all spaces and non-digits, then strip leading zero
  const cleaned = phone.replace(/\D/g, '');
  // Assume Nigerian number: remove leading zero and prepend 234
  let number = cleaned;
  if (number.startsWith('0')) {
    number = '234' + number.slice(1);
  }
  return `https://wa.me/${number}`;
});


  // ── MARKDOWN ──
  const markdownIt = require("markdown-it");
  const md = markdownIt({
    html: true,
    breaks: true,
    linkify: true
  });

  // Wrap every embedded markdown image — remote links used in insights,
  // or local files sitting in a case study's own /assets/images/case-studies/<slug>/
  // folder — in a <figure class="content-image"> so both page types render
  // and style images identically (see .content-body figure.content-image
  // rules in insight-layout.njk / case-study-layout.njk). Also adds
  // loading="lazy" to avoid layout shift on long article pages.
  const defaultImageRender = md.renderer.rules.image || function (tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
  };

  md.renderer.rules.image = function (tokens, idx, options, env, self) {
    const token = tokens[idx];
    token.attrSet("loading", "lazy");

    const altIndex = token.attrIndex("alt");
    const altText = altIndex >= 0 ? token.attrs[altIndex][1] : "";
    const imgHtml = defaultImageRender(tokens, idx, options, env, self);

    if (altText) {
      return `<figure class="content-image">${imgHtml}<figcaption>${md.utils.escapeHtml(altText)}</figcaption></figure>`;
    }
    return `<figure class="content-image">${imgHtml}</figure>`;
  };

  // markdown-it always wraps a standalone image line in <p>...</p>, which
  // would produce invalid <p><figure>...</figure></p> nesting once the
  // image rule above wraps it in a <figure>. Skip the <p> wrapper for any
  // paragraph that contains nothing but an image.
  function isImageOnlyParagraph(tokens, idx) {
    const inline = tokens[idx];
    return inline && inline.type === "inline" && inline.children.length === 1 && inline.children[0].type === "image";
  }

  md.renderer.rules.paragraph_open = function (tokens, idx, options, env, self) {
    if (isImageOnlyParagraph(tokens, idx + 1)) return "";
    return self.renderToken(tokens, idx, options);
  };

  md.renderer.rules.paragraph_close = function (tokens, idx, options, env, self) {
    if (isImageOnlyParagraph(tokens, idx - 1)) return "";
    return self.renderToken(tokens, idx, options);
  };

  eleventyConfig.setLibrary("md", md);

  // ── WATCH & SERVE ──
  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["njk", "md", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};