import React from "react";
import TeX from "@matejmazur/react-katex";
import "katex/dist/katex.min.css";

interface LatexRendererProps {
  content: string;
}

const LatexRenderer: React.FC<LatexRendererProps> = ({ content }) => {
  const segments = content.split(
    /(\$\$.*?\$\$|\$.*?\$|\\\[.*?\\\]|\\\(.*?\\\))/gs
  );

  return (
    <span className="latex-content">
      {segments.map((segment, index) => {
        if (segment.match(/^\$\$.*\$\$$/s) || segment.match(/^\\\[.*\\\]$/s)) {
          const latexContent = segment
            .replace(/^\$\$|\$\$$|^\\\[|\\\]$/g, "")
            .trim();
          return <TeX key={index} block math={latexContent} />;
        }
        else if (segment.match(/^\$.*\$$/s) || segment.match(/^\\\(.*\\\)$/s)) {
          const latexContent = segment
            .replace(/^\$|\$$|^\\\(|\\\)$/g, "")
            .trim();
          return <TeX key={index} math={latexContent} />;
        }
        return <span key={index}>{segment}</span>;
      })}
    </span>
  );
};

export default LatexRenderer;
