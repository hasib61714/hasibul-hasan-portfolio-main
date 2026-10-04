import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import { safeUrl } from "@/lib/utils";

const components: Components = {
  h1: (p) => <h2 className="mb-4 mt-10 text-3xl font-bold tracking-tight text-gray-900 dark:text-white" {...p} />,
  h2: (p) => <h2 className="mb-4 mt-10 text-2xl font-bold tracking-tight text-gray-900 dark:text-white" {...p} />,
  h3: (p) => <h3 className="mb-3 mt-8 text-xl font-bold text-gray-900 dark:text-white" {...p} />,
  h4: (p) => <h4 className="mb-2 mt-6 text-lg font-semibold text-gray-900 dark:text-white" {...p} />,
  p: (p) => <p className="my-5 leading-8 text-gray-700 dark:text-gray-300" {...p} />,
  ul: (p) => <ul className="my-5 list-disc space-y-2 pl-6 text-gray-700 marker:text-brand-500 dark:text-gray-300" {...p} />,
  ol: (p) => <ol className="my-5 list-decimal space-y-2 pl-6 text-gray-700 marker:text-brand-500 dark:text-gray-300" {...p} />,
  li: (p) => <li className="leading-7" {...p} />,
  blockquote: (p) => (
    <blockquote className="my-6 border-l-4 border-brand-500/60 bg-brand-500/5 py-2 pl-5 pr-3 italic text-gray-700 dark:text-gray-300" {...p} />
  ),
  hr: () => <hr className="my-10 border-gray-200 dark:border-white/10" />,
  a: ({ href, children }) => {
    const safe = safeUrl(href) ?? (href?.startsWith("/") || href?.startsWith("#") ? href : undefined);
    if (!safe) return <span>{children}</span>;
    const external = /^https?:/i.test(safe);
    return (
      <a
        href={safe}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="font-medium text-brand-600 underline decoration-brand-500/40 underline-offset-4 hover:decoration-brand-500 dark:text-brand-300"
      >
        {children}
      </a>
    );
  },
  img: ({ src, alt }) => {
    const safe = typeof src === "string" ? safeUrl(src) : undefined;
    // eslint-disable-next-line @next/next/no-img-element
    return safe ? <img src={safe} alt={alt ?? ""} loading="lazy" className="my-8 w-full rounded-2xl border border-gray-200 dark:border-white/10" /> : null;
  },
  pre: (p) => (
    <pre className="my-6 overflow-x-auto rounded-2xl border border-gray-200 bg-gray-950 p-5 font-mono text-[13px] leading-6 text-gray-100 dark:border-white/10" {...p} />
  ),
  code: ({ className, children, ...rest }) => {
    const isBlock = /language-/.test(className ?? "");
    return isBlock ? (
      <code className={className} {...rest}>{children}</code>
    ) : (
      <code className="rounded-md bg-gray-100 px-1.5 py-0.5 font-mono text-[0.9em] text-brand-700 dark:bg-white/10 dark:text-brand-200" {...rest}>{children}</code>
    );
  },
  table: (p) => (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse text-sm" {...p} />
    </div>
  ),
  th: (p) => <th className="border-b border-gray-300 px-3 py-2 text-left font-semibold text-gray-900 dark:border-white/15 dark:text-white" {...p} />,
  td: (p) => <td className="border-b border-gray-200 px-3 py-2 text-gray-700 dark:border-white/10 dark:text-gray-300" {...p} />,
};

/** Safe Markdown renderer: raw HTML is not allowed and URLs are sanitised. */
export function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {children}
    </ReactMarkdown>
  );
}
