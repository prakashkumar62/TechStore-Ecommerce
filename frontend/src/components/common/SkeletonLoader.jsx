import React from 'react';

export const ProductSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200 animate-pulse flex flex-col justify-between">
      <div className="w-full h-52 bg-slate-200 rounded-xl mb-4"></div>
      <div className="space-y-2">
        <div className="h-3 bg-slate-200 rounded w-1/3"></div>
        <div className="h-4 bg-slate-200 rounded w-4/5"></div>
        <div className="h-4 bg-slate-200 rounded w-2/3"></div>
      </div>
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="h-6 bg-slate-200 rounded w-1/3"></div>
        <div className="h-9 w-9 bg-slate-200 rounded-xl"></div>
      </div>
    </div>
  );
};

export const TableSkeleton = ({ rows = 5 }) => {
  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse">
      <div className="h-12 bg-slate-100 border-b border-slate-200"></div>
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, idx) => (
          <div key={idx} className="h-16 px-6 flex items-center gap-4">
            <div className="h-4 bg-slate-200 rounded w-1/6"></div>
            <div className="h-4 bg-slate-200 rounded w-2/6"></div>
            <div className="h-4 bg-slate-200 rounded w-1/6"></div>
            <div className="h-4 bg-slate-200 rounded w-1/6"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const DetailSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div className="h-[480px] bg-slate-200 rounded-3xl"></div>
      <div className="space-y-6">
        <div className="h-4 bg-slate-200 rounded w-1/4"></div>
        <div className="h-8 bg-slate-200 rounded w-3/4"></div>
        <div className="h-6 bg-slate-200 rounded w-1/3"></div>
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 rounded w-full"></div>
          <div className="h-4 bg-slate-200 rounded w-5/6"></div>
          <div className="h-4 bg-slate-200 rounded w-4/6"></div>
        </div>
        <div className="h-12 bg-slate-200 rounded-xl w-1/2"></div>
      </div>
    </div>
  );
};
