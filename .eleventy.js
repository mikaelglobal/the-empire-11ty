module.exports = function(eleventyConfig) {
  // ── PASSTHROUGH COPIES ──
  eleventyConfig.addPassthroughCopy("src/assets/images");
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
  // Reads from site.data.insights and creates a collection with permalinks
  eleventyConfig.addCollection("insights", function(collectionApi) {
    const insights = require("./src/_data/site.json").insights || [];
    // Add a computed url field for each insight
    return insights.map(insight => {
      return {
        data: insight,
        url: `/insights/${insight.slug}/`,
        date: new Date(insight.date)
      };
    }).sort((a, b) => b.date - a.date);
  });

  // ── CASE STUDIES COLLECTION ──
  eleventyConfig.addCollection("caseStudies", function(collectionApi) {
    const caseStudies = require("./src/_data/site.json").caseStudies || [];
    return caseStudies.map(cs => {
      return {
        data: cs,
        url: `/case-studies/${cs.slug}/`
      };
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
  eleventyConfig.setLibrary("md", markdownIt({
    html: true,
    breaks: true,
    linkify: true
  }));

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