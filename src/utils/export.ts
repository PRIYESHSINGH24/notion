import { Page } from '../types';

function extractText(content: any): string {
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) {
    return content.map((c) => (typeof c === 'string' ? c : c.text || '')).join('');
  }
  return '';
}

export function pageToMarkdown(page: Page): string {
  let md = `# ${page.icon ? page.icon + ' ' : ''}${page.title || 'Untitled'}\n\n`;

  for (const block of page.blocks || []) {
    const text = extractText(block.content);
    switch (block.type) {
      case 'heading': {
        const level = (block.props as any)?.level || 1;
        const prefix = '#'.repeat(level);
        md += `${prefix} ${text}\n\n`;
        break;
      }
      case 'paragraph':
        md += `${text}\n\n`;
        break;
      case 'bulletListItem':
        md += `- ${text}\n`;
        break;
      case 'numberedListItem':
        md += `1. ${text}\n`;
        break;
      case 'checkListItem': {
        const checked = (block.props as any)?.checked ? 'x' : ' ';
        md += `- [${checked}] ${text}\n`;
        break;
      }
      case 'quote':
        md += `> ${text}\n\n`;
        break;
      case 'codeBlock': {
        const lang = (block.props as any)?.language || '';
        md += `\`\`\`${lang}\n${text}\n\`\`\`\n\n`;
        break;
      }
      case 'divider':
        md += `---\n\n`;
        break;
      case 'table': {
        const rows = (block.content as any)?.rows || [];
        for (let i = 0; i < rows.length; i++) {
          const cells = rows[i].cells?.map((c: any) => extractText(c)) || [];
          md += `| ${cells.join(' | ')} |\n`;
          if (i === 0) {
            md += `| ${cells.map(() => '---').join(' | ')} |\n`;
          }
        }
        md += '\n';
        break;
      }
      default:
        if (text) {
          md += `${text}\n\n`;
        }
        break;
    }
  }

  return md;
}

export function downloadFile(content: string, filename: string, type: string = 'text/plain') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
