// Keep complete utility strings here so Tailwind can discover every variant.
export const focus = 'focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-ascend-accent focus-visible:outline-offset-4';
export const disabled = 'disabled:cursor-wait disabled:opacity-[.65]';
export const container = 'mx-auto w-[calc(100%_-_40px)] md:w-[min(1216px,calc(100%_-_64px))] as-tiny:w-[calc(100%_-_32px)] as-compact:w-[min(1094px,calc(100%_-_58px))]';
export const brand = `inline-flex shrink-0 items-center gap-[calc(var(--as-mark-height)*.25)] whitespace-nowrap text-inherit ${focus}`;

const buttonBase = `inline-flex items-center justify-center gap-2 rounded-full border text-center font-bold leading-[1.5] transition-colors duration-150 motion-reduce:transition-none [&:is(a,button):hover]:bg-[#1d4ed8] ${focus} ${disabled}`;
const buttonColors = {
  primary: 'border-transparent bg-ascend-blue text-white',
  outline: 'border-ascend-line bg-transparent text-ascend-ink',
  white: 'border-[#ffffffb3] bg-transparent text-white',
};
const buttonSizes = {
  default: 'min-h-12 px-[27px] py-3.5 text-[16px] as-compact:px-6 as-compact:py-[11px]',
  nav: 'min-h-12 px-[22px] py-3 text-[15px] as-compact:min-h-11 as-compact:px-5 as-compact:py-2.5 as-compact:text-[14px]',
  service: 'min-h-12 px-3 py-3.5 text-[16px] as-compact:py-[11px]',
};
export const button = (variant: keyof typeof buttonColors = 'primary', size: keyof typeof buttonSizes = 'default') => `${buttonBase} ${buttonColors[variant]} ${buttonSizes[size]}`;
export const badge = (hero = false) => `inline-block w-fit rounded-full border px-3.5 py-1.5 font-semibold tracking-[.015em] ${hero ? 'border-[#ffffffa8] text-[10px] md:text-[11px]' : 'border-ascend-accent text-[12px]'}`;
export const section = 'relative scroll-mt-[calc(var(--as-header-height)_+_16px)] py-14 md:py-20 as-compact:py-[clamp(43px,5.4vh,50px)]';
export const heading = 'font-bold leading-[1.125] tracking-[-.02em]';
export const sectionHeading = `${heading} text-[clamp(32px,4vw,56px)] as-compact:text-[clamp(32px,2.7vw,36px)]`;
export const sectionCopy = 'mt-4 max-w-[640px] text-[18px] font-medium text-ascend-muted as-compact:text-[16px]';
export const panel = 'rounded-3xl border border-ascend-line bg-ascend-panel';
export const formSection = `m-0 min-w-0 border-0 border-t border-ascend-line px-0 pb-0 pt-6 first-of-type:border-t-0 first-of-type:pt-0 [&>legend+*]:clear-both ${disabled}`;
export const formLegend = 'float-left mb-4 flex w-full items-baseline gap-3 p-0 text-[20px] font-bold sm:text-[22px] as-compact:text-[20px]';
export const contactGrid = 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4';
export const fieldError = 'mt-1.5 text-[14px] text-ascend-error';
export const guidance = 'mt-4 text-[13px] text-ascend-muted';
export const input = `block w-full max-w-full rounded-xl border border-ascend-field bg-ascend-input px-4 py-3 text-[16px] text-ascend-ink placeholder:text-ascend-muted placeholder:opacity-100 aria-[invalid=true]:border-ascend-error ${focus} ${disabled}`;
