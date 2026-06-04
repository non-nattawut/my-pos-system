export function formatDateTime(dateStrOrObj?: string | Date): string {
  if (!dateStrOrObj) return 'N/A';
  try {
    const d = typeof dateStrOrObj === 'string' ? new Date(dateStrOrObj) : dateStrOrObj;
    if (isNaN(d.getTime())) return 'N/A';
    return `${d.toLocaleDateString()} @ ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  } catch {
    return 'N/A';
  }
}

export function formatTime(dateStrOrObj?: string | Date): string {
  if (!dateStrOrObj) return 'N/A';
  try {
    const d = typeof dateStrOrObj === 'string' ? new Date(dateStrOrObj) : dateStrOrObj;
    if (isNaN(d.getTime())) return 'N/A';
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return 'N/A';
  }
}

export function formatDateTimeSpace(dateStrOrObj?: string | Date): string {
  if (!dateStrOrObj) return 'N/A';
  try {
    const d = typeof dateStrOrObj === 'string' ? new Date(dateStrOrObj) : dateStrOrObj;
    if (isNaN(d.getTime())) return 'N/A';
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  } catch {
    return 'N/A';
  }
}

export function formatDate(dateStrOrObj?: string | Date): string {
  if (!dateStrOrObj) return 'N/A';
  try {
    const d = typeof dateStrOrObj === 'string' ? new Date(dateStrOrObj) : dateStrOrObj;
    if (isNaN(d.getTime())) return 'N/A';
    return d.toLocaleDateString();
  } catch {
    return 'N/A';
  }
}
