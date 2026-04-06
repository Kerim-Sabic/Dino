import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownContentProps {
  content: string;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div className="space-y-6">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <h1 className="text-5xl text-white">{children}</h1>,
          h2: ({ children }) => <h2 className="mt-8 text-4xl text-white">{children}</h2>,
          h3: ({ children }) => <h3 className="mt-6 text-3xl text-white">{children}</h3>,
          p: ({ children }) => <p className="text-sm leading-8 text-zinc-300">{children}</p>,
          ul: ({ children }) => <ul className="space-y-3 pl-5 text-sm text-zinc-300">{children}</ul>,
          ol: ({ children }) => <ol className="space-y-3 pl-5 text-sm text-zinc-300">{children}</ol>,
          li: ({ children }) => <li className="list-disc leading-8">{children}</li>,
          strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
          a: ({ href, children }) => (
            <a href={href} className="text-primary underline underline-offset-4">
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
