import React from "react";
import TeX from "@matejmazur/react-katex";
import "katex/dist/katex.min.css";

interface LatexRendererProps {
  content: string;
}

const LatexRenderer: React.FC<LatexRendererProps> = ({ content }) => {
  // This renderer handles standalone LaTeX expressions that may not be captured
  // by the Markdown processor in MarkdownWithLatex

  // Split content into text and LaTeX blocks
  // Matches $...$, \[...\], and \(...\)
  const segments = content.split(
    /(\$\$.*?\$\$|\$.*?\$|\\\[.*?\\\]|\\\(.*?\\\))/gs
  );

  return (
    <span className="latex-content">
      {segments.map((segment, index) => {
        // Check for display math: $$...$$, \[...\]
        if (segment.match(/^\$\$.*\$\$$/s) || segment.match(/^\\\[.*\\\]$/s)) {
          const latexContent = segment
            .replace(/^\$\$|\$\$$|^\\\[|\\\]$/g, "")
            .trim();
          return <TeX key={index} block math={latexContent} />;
        }
        // Check for inline math: $...$, \(...\)
        else if (segment.match(/^\$.*\$$/s) || segment.match(/^\\\(.*\\\)$/s)) {
          const latexContent = segment
            .replace(/^\$|\$$|^\\\(|\\\)$/g, "")
            .trim();
          return <TeX key={index} math={latexContent} />;
        }
        // Regular text
        return <span key={index}>{segment}</span>;
      })}
    </span>
  );
};

export default LatexRenderer;
