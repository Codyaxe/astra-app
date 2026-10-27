export function emailError(raw: string): string | undefined {
    const value = raw.trim();
    if (!value) return 'Enter your email address.';
    const parts = value.split('@');
    const local = parts[0];
    const domain = parts[1] || '';
    const labels = domain.split('.');
    const valid =
        parts.length === 2 &&
        value.length <= 254 &&
        local.length <= 64 &&
        /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+$/i.test(local) &&
        !local.startsWith('.') &&
        !local.endsWith('.') &&
        !local.includes('..') &&
        labels.length >= 2 &&
        labels.every(
            (label) =>
                label.length <= 63 &&
                /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(label),
        ) &&
        /^(?:[a-z]{2,}|xn--[a-z0-9-]+)$/i.test(labels[labels.length - 1]);
    return valid
        ? undefined
        : 'Enter a valid email address, such as you@example.com.';
}

export function isValidDate(value: string): boolean {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(`${value}T00:00:00Z`);
    return (
        !Number.isNaN(date.getTime()) &&
        date.toISOString().slice(0, 10) === value
    );
}
