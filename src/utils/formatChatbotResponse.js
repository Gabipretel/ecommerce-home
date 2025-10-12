const formatChatbotResponse = (text) => {
  // Expresión regular para detectar tablas Markdown
  const tableRegex = /(\|.*\|\s*\n\|[-|\s]+\|\s*\n)((?:\|.*\|\s*\n)+)/g;

  return text.replace(tableRegex, (match, header, rows) => {
    const rowsArray = rows.trim().split('\n');
    let formattedText = '';
    let currentCategory = '';

    rowsArray.forEach(row => {
      // Limpiar y dividir las celdas
      const cells = row.split('|')
        .filter(cell => cell.trim() !== '')
        .map(cell => cell.trim());

      if (cells.length >= 2) {
        const category = cells[0];
        const product = cells[1];
        const specs = cells[2] || '';
        const price = cells[3] || '';

        // Agrupar por categoría con emojis gaming
        if (category !== currentCategory) {
          const categoryEmoji = getCategoryEmoji(category);
          formattedText += `\n${categoryEmoji} ${category.toUpperCase()}:\n`;
          currentCategory = category;
        }

        // Formatear cada producto
        formattedText += `🔹 ${product}`;
        if (specs) formattedText += ` (${specs})`;
        if (price) formattedText += ` - ${price}`;
        formattedText += '\n';
      }
    });

    return formattedText;
  });
};

const getCategoryEmoji = (category) => {
  const categoryLower = category.toLowerCase();
  
  if (categoryLower.includes('gpu') || categoryLower.includes('gráfica')) return '🎮';
  if (categoryLower.includes('cpu') || categoryLower.includes('procesador')) return '⚡';
  if (categoryLower.includes('ram') || categoryLower.includes('memoria')) return '🧠';
  if (categoryLower.includes('ssd') || categoryLower.includes('disco')) return '💾';
  if (categoryLower.includes('monitor')) return '🖥️';
  if (categoryLower.includes('teclado')) return '⌨️';
  if (categoryLower.includes('mouse')) return '🖱️';
  if (categoryLower.includes('headset') || categoryLower.includes('auricular')) return '🎧';
  if (categoryLower.includes('laptop')) return '💻';
  if (categoryLower.includes('consola')) return '🎯';
  
  return '🔧'; // Default para hardware general
};

export default formatChatbotResponse;
