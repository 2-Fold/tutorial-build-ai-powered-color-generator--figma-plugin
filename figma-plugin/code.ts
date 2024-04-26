interface Color {
  name: string;
  value: string;
}

async function createColorPalette(colors: Color[]) {
  const nodes: SceneNode[] = [];
  colors.forEach(({ name, value }) => {
    const rect = figma.createRectangle();
    rect.name = name;
    rect.cornerRadius = 24;
    rect.fills = [{ type: 'SOLID', color: figma.util.rgb(value) }];
    rect.x = nodes.length * 120;
    rect.y = 0;
    rect.resize(100, 100);
    nodes.push(rect);
  });

  figma.currentPage.selection = nodes;
  figma.viewport.scrollAndZoomIntoView(nodes);
}

async function fetchColors(colorsDescription: string) {
  return fetch('http://localhost:3000', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ payload: colorsDescription }),
  })
    .then((response) => response.json())
    .then((data) => data.choices[0].message.content)
    .catch((error) => error);
}

async function parseData(data: string) {
  try {
    const parsedData = JSON.parse(data);
    return parsedData;
  } catch (error) {
    console.error('Invalid JSON');
    return null;
  }
}

figma.on('run', async ({ parameters }: RunEvent) => {
  const colorsDescription = parameters?.['colorsDescription'].trim();
  const colorArray = await fetchColors(colorsDescription);
  const parsedColorArray = await parseData(colorArray);
  if (!parsedColorArray) {
    figma.closePlugin('Invalid JSON');
    return;
  }
  await createColorPalette(parsedColorArray);
  figma.closePlugin();
});
