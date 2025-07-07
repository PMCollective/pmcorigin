import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { MapPin, Building, Clock, ExternalLink, Briefcase, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const XLSX_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ7a7mXUTISq9SRrwi5Uhgv3EnBuaAkXH22_uDtC9laDo78Lw9bqf6iqmYreduoog2IoE9FLef7yf2w/pubhtml?gid=0&single=true";

export function JobPostings() {
  const [header, setHeader] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(XLSX_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch XLSX file: ${res.status} ${res.statusText}`);
        return res.arrayBuffer();
      })
      .then((ab) => {
        const workbook = XLSX.read(ab, { type: "array" });
        const sheetName = workbook.SheetNames.find(name => name === "Linkedin") || workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        if (!sheet) throw new Error(`Sheet "Linkedin" not found in XLSX`);
        const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as string[][];
        setHeader(data[0]);
        setRows(data.slice(1));
        setLoading(false);
      })
      .catch((err) => {
        setError(`Error loading job postings: ${err.message}`);
        setLoading(false);
      });
  }, []);

  const getFieldIcon = (fieldName: string) => {
    if (!fieldName || typeof fieldName !== 'string') return <Briefcase className="w-4 h-4 text-gray-500" />;
    const field = fieldName.toLowerCase();
    if (field.includes('company')) return <Building className="w-4 h-4 text-blue-500" />;
    if (field.includes('location')) return <MapPin className="w-4 h-4 text-green-500" />;
    if (field.includes('time') || field.includes('date')) return <Clock className="w-4 h-4 text-orange-500" />;
    if (field.includes('link')) return <ExternalLink className="w-4 h-4 text-purple-500" />;
    return <Briefcase className="w-4 h-4 text-gray-500" />;
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  const getJobTitle = (row: string[]) => {
    // Assume first column is job title, or look for title-like field
    const titleIndex = header.findIndex(h => h && typeof h === 'string' && h.toLowerCase().includes('title'));
    if (titleIndex !== -1) return row[titleIndex];
    return row[0] || 'Untitled Position';
  };

  const getCompany = (row: string[]) => {
    const companyIndex = header.findIndex(h => h && typeof h === 'string' && h.toLowerCase().includes('company'));
    if (companyIndex !== -1) return row[companyIndex];
    return null;
  };

  const getLocation = (row: string[]) => {
    const locationIndex = header.findIndex(h => h && typeof h === 'string' && h.toLowerCase().includes('location'));
    if (locationIndex !== -1) return row[locationIndex];
    return null;
  };

  const getLink = (row: string[]) => {
    const linkIndex = header.findIndex(h => h && typeof h === 'string' && h.toLowerCase().includes('link'));
    if (linkIndex !== -1) return row[linkIndex];
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading job postings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl border border-red-100">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-red-600 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
      {/* Header */}
      <Link
            to="/"
            className="text-gray-600 hover:text-gray-800 mr-4"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          LinkedIn Job Postings
        </h1>
        <p className="text-gray-600 text-xl">Find your next opportunity</p>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-4 rounded-full"></div>
      </div>

      {rows.length > 0 ? (
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 max-w-7xl mx-auto">
          {rows
            .filter((row) => row.length > 0 && row[0])
            .map((row, idx) => {
              const jobTitle = getJobTitle(row);
              const company = getCompany(row);
              const location = getLocation(row);
              const link = getLink(row);
              
              return (
                <div
                  key={idx}
                  className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden hover:-translate-y-1"
                >
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
                    <h3 className="text-xl font-bold mb-2 leading-tight">
                      {truncateText(jobTitle, 40)}
                    </h3>
                    {company && (
                      <div className="flex items-center gap-2 text-blue-100">
                        <Building className="w-4 h-4" />
                        <span className="text-sm">{truncateText(company, 30)}</span>
                      </div>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-6">
                    {/* Location */}
                    {location && (
                      <div className="flex items-center gap-2 mb-4 text-gray-600">
                        <MapPin className="w-4 h-4 text-green-500" />
                        <span className="text-sm">{truncateText(location, 35)}</span>
                      </div>
                    )}

                    {/* Other Fields */}
                    <div className="space-y-3 mb-6">
                      {row.map((value, colIdx) => {
                        const fieldName = header[colIdx] || '';
                        const isTitle = (fieldName && typeof fieldName === 'string' && fieldName.toLowerCase().includes('title')) || colIdx === 0;
                        const isCompany = fieldName && typeof fieldName === 'string' && fieldName.toLowerCase().includes('company');
                        const isLocation = fieldName && typeof fieldName === 'string' && fieldName.toLowerCase().includes('location');
                        const isLink = fieldName && typeof fieldName === 'string' && fieldName.toLowerCase().includes('link');
                        
                        // Skip already displayed fields and empty values
                        if (isTitle || isCompany || isLocation || isLink || !value || colIdx === 2) {
                          return null;
                        }

                        return (
                          <div key={colIdx} className="flex items-start gap-3">
                            {getFieldIcon(fieldName)}
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                                {fieldName}
                              </div>
                              <div className="text-sm text-gray-800 break-words">
                                {truncateText(value, 60)}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Action Button */}
                    {link && (
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl group-hover:scale-105 transform"
                      >
                        <span>View Job</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📋</div>
          <p className="text-gray-500 text-xl mb-2">No job postings found</p>
          <p className="text-gray-400">Check if the "Linkedin" sheet has data or the XLSX URL is correct.</p>
        </div>
      )}
    </div>
  );
}