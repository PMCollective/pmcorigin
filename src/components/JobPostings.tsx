import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ExternalLink,
  Calendar,
  User,
  Briefcase,
  FileText,
} from "lucide-react";

const SHEETDB_API_URL = "https://sheetdb.io/api/v1/tfch1mt1edldd";

type SheetJob = { [key: string]: any };

export default function JobPostings() {
  const [items, setItems] = useState<
    { creator?: string; title?: string; link?: string; pubDate?: string; contentSnippet?: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch(SHEETDB_API_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch data: ${res.status}`);
        return res.json();
      })
      .then((json: SheetJob[]) => {
        if (!mounted) return;
        const mapped = (json || []).map((job) => {
          const title = job.title || job.Title || job["Job Title"] || job["Title/Position"] || "";
          const creator = job.creator || job.Creator || job.author || job.Author || job.company || "";
          const link = job.link || job.Link || job.url || job.URL || job.apply || "";
          const pubDate =
            job.pubDate ||
            job.pub_date ||
            job["PubDate"] ||
            job.published ||
            job.Published ||
            job.date ||
            job.Date ||
            "";
          const contentSnippet =
            job.contentSnippet ||
            job.ContentSnippet ||
            job.snippet ||
            job.Snippet ||
            job.description ||
            job.Description ||
            "";
          return { creator, title, link, pubDate, contentSnippet };
        });
        setItems(mapped.filter((m) => m.title && m.link));
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message || "Failed to load data");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const truncate = (text?: string, len = 160) =>
    text && text.length > len ? `${text.slice(0, len)}...` : text || "";

  const formatDate = (d?: string) => {
    if (!d) return "";
    const parsed = Date.parse(d);
    if (isNaN(parsed)) return d;
    return new Date(parsed).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-800 p-6">
        <div className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-indigo-500 animate-spin" />
        <h2 className="mt-6 text-xl font-semibold text-slate-900">Loading Opportunities</h2>
        <p className="text-sm text-slate-600 mt-1">Fetching the latest job postings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="max-w-xl text-center bg-white rounded-xl shadow-md p-6 border border-slate-100">
          <Briefcase className="mx-auto text-indigo-600 w-10 h-10" />
          <h3 className="mt-4 text-lg font-semibold text-slate-900">Unable to load jobs</h3>
          <p className="mt-2 text-sm text-slate-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-600 p-6">
        <div className="text-center">
          <FileText className="mx-auto text-indigo-600 w-12 h-12" />
          <h3 className="mt-4 text-lg font-semibold text-slate-900">No job postings available</h3>
          <p className="mt-2 text-sm">Check back later for new opportunities.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 sm:p-10">
      <div className="max-w-6xl mx-auto">
        <header className="mb-6 flex items-center gap-4">
          <Link to="/" className="text-slate-600 hover:text-slate-800 p-2 rounded-md">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Career Opportunities</h1>
            <p className="text-sm text-slate-600">Explore the latest job postings curated for you.</p>
          </div>
        </header>

        <div className="grid gap-6 sm:grid-cols-2">
          {items.map((job, idx) => (
            <article
              key={idx}
              className="relative bg-white rounded-2xl shadow-sm border border-slate-100 p-5 hover:shadow-lg transition-shadow flex flex-col h-full"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center">
                    <Briefcase className="text-indigo-600 w-6 h-6" />
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">
                    <a href={job.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {job.title}
                    </a>
                  </h3>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-3">
                    {job.creator && (
                      <div className="flex items-center gap-2 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                        <User className="w-3.5 h-3.5 text-indigo-500" />
                        <span className="font-medium text-slate-700">{job.creator}</span>
                      </div>
                    )}

                    {job.pubDate && (
                      <div className="flex items-center gap-2 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                        <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                        <span className="text-slate-500">{formatDate(job.pubDate)}</span>
                      </div>
                    )}
                  </div>

                  {job.contentSnippet && (
                    <p className="text-sm text-slate-700 leading-relaxed mb-4">{truncate(job.contentSnippet)}</p>
                  )}
                </div>
              </div>

              {/* Button placed at bottom and occupying 80% width */}
              <div className="mt-auto flex justify-center">
                <a
                  href={job.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-4/5 inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg text-sm shadow-sm transition-colors"
                  title="Open listing"
                >
                  View
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}