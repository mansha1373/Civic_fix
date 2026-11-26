import React from "react"
import { TrendingUp, TrendingDown } from "lucide-react"

const VARIANT_MAP = {
  burgundy: {
    bg: "bg-[#F5ECEE]",
    iconColor: "text-[#59343B]"
  },
  yellow: {
    bg: "bg-[#FFF4D0]",
    iconColor: "text-[#7A5300]"
  },
  amber: {
    bg: "bg-[#FEF3C7]",
    iconColor: "text-[#C05621]"
  },
  emerald: {
    bg: "bg-[#EBF5EE]",
    iconColor: "text-[#1E5C31]"
  },
  rose: {
    bg: "bg-[#FAECEE]",
    iconColor: "text-[#93272C]"
  }
}

export default function AdminStatCard({
  title,
  count,
  change,
  isPositive,
  icon: IconComponent,
  variant = "burgundy"
}) {
  const currentVariant = VARIANT_MAP[variant] || VARIANT_MAP.burgundy

  return (
    <div className="bg-white p-5 rounded-2xl border border-[#EAE3D5] shadow-civic hover:border-[#59343B]/40 transition duration-150">
      <div className="flex items-center justify-between text-[#695154]">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#695154]">
          {title}
        </span>
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center ${currentVariant.bg} ${currentVariant.iconColor}`}
        >
          {IconComponent && <IconComponent className="w-4 h-4 stroke-[2.2]" />}
        </div>
      </div>

      <h3 className="text-2xl sm:text-3xl font-extrabold text-[#281719] font-serif mt-2.5">
        {count}
      </h3>

      {change && (
        <p
          className={`text-[11px] font-bold mt-2 flex items-center gap-1 ${
            isPositive ? "text-[#1E5C31]" : "text-[#93272C]"
          }`}
        >
          {isPositive ? (
            <TrendingUp className="w-3.5 h-3.5" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5" />
          )}
          <span>{change} vs last month</span>
        </p>
      )}
    </div>
  )
}
