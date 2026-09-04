import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Package id -> list of category labels (multi-category). Used by /pakiety listing and PackagesSection pills. */
export const packageCategoryMap: Record<string, string[]> = {
  // --- pakiety.json ---
  "aresztowanie-tancerz-limuzyna-dywan-klub":           ["Polecane", "Aresztowanie", "Sexy", "Nocne", "Imprezowe"],
  "vip-arrest-tancerz-limuzyna-sesja-klub-loza":        ["Polecane", "Aresztowanie", "Sexy", "Nocne", "Imprezowe", "Posiłki"],
  "vip-arrest-tancerz-limuzyna-klub":                   ["Polecane", "Aresztowanie", "Sexy", "Nocne", "Imprezowe"],
  "vip-arrest-tancerz-limuzyna":                        ["Aresztowanie", "Sexy"],
  "panienski-vip-loza-limuzyna-sesja":                  ["Nocne", "Imprezowe", "Posiłki", "Dzienne"],
  "limuzyna-sesja-klub-vip":                            ["Nocne", "Imprezowe", "Dzienne"],
  "fotograf-klub-vip":                                  ["Nocne", "Imprezowe", "Plenerowe", "Dzienne"],
  "karaoke-beer-pong-limuzyna-tancerz-klub":            ["Polecane", "Sexy", "Nocne", "Imprezowe"],
  "karaoke-beer-pong-limuzyna-sesja-klub":              ["Nocne", "Imprezowe", "Dzienne"],
  "limuzyna-piknik-sesja-klub":                         ["Polecane", "Piknik", "Plenerowe", "Posiłki", "Dzienne", "Nocne", "Relaks"],
  "porwanie-sesja-dywan-limuzyna-klub":                  ["Polecane", "Aresztowanie", "Sexy", "Nocne", "Imprezowe"],
  "fotograf-limuzyna-dywan-klub":                       ["Polecane", "Nocne", "Imprezowe", "Dzienne"],
  "sesja-wideo-limuzyna-dywan-klub":                    ["Nocne", "Imprezowe", "Dzienne"],
  "sesja-wideo-limuzyna-klub":                          ["Nocne", "Imprezowe", "Dzienne"],
  "fotograf-restauracja-limuzyna-dywan-klub":           ["Polecane", "Nocne", "Imprezowe", "Posiłki", "Dzienne"],
  "restauracja-tancerz-limuzyna-dywan-klub":            ["Sexy", "Nocne", "Imprezowe", "Posiłki", "Dzienne"],
  "pakiet-sexy-panienski":                              ["Sexy", "Nocne", "Imprezowe"],
  "taniec-limuzyna-tancerz-klub":                       ["Sexy", "Nocne", "Imprezowe", "Dzienne"],
  "porwanie-tancerz-sesja-dywan-limuzyna-klub":          ["Polecane", "Aresztowanie", "Sexy", "Nocne", "Imprezowe"],
  "gokarty-limuzyna-klub":                              ["Nocne", "Imprezowe", "Dzienne", "Plenerowe"],
  "limuzyna-spa":                                       ["Polecane", "Dzienne", "Relaks"],
  "fotograf-taniec-limuzyna-klub":                      ["Sexy", "Nocne", "Imprezowe", "Plenerowe", "Dzienne"],
  "fotograf-limuzyna-tancerz-klub":                     ["Polecane", "Sexy", "Nocne", "Imprezowe", "Plenerowe", "Dzienne"],
  "piknik-fotograf-gondola":                            ["Polecane", "Piknik", "Plenerowe", "Posiłki", "Dzienne", "Relaks"],
  "limuzyna-fotograf-piknik":                           ["Piknik", "Plenerowe", "Posiłki", "Dzienne", "Relaks"],
  "objazd-po-klubach":                                  ["Nocne", "Imprezowe"],
  "fotograf-piknik":                                    ["Piknik", "Plenerowe", "Posiłki", "Dzienne", "Relaks"],
  "fotograf-limuzyna":                                  ["Plenerowe", "Dzienne"],
  "fotograf-tancerz-apartament":                        ["Sexy", "Imprezowe"],
  "kregle-limuzyna-klub":                               ["Nocne", "Imprezowe", "Dzienne"],
  "loza-limuzyna":                                      ["Nocne", "Imprezowe", "Posiłki", "Dzienne"],
  "loza-limuzyna-tancerz":                              ["Polecane", "Sexy", "Nocne", "Imprezowe", "Posiłki", "Dzienne"],
  // --- pakiety-na-wieczor.json ---
  "pakiet-dla-odwaznych-lasek":                         ["Sexy", "Nocne", "Imprezowe", "Posiłki"],
};

export const PACKAGE_CATEGORY_KEYS = [
  "Wszystko", "Polecane",
  "Piknik", "Aresztowanie", "Sexy", "Nocne", "Imprezowe",
  "Plenerowe", "Dzienne", "Posiłki", "Relaks",
];

export function getPackageCategories(id: string): string[] {
  return packageCategoryMap[id] || [];
}
