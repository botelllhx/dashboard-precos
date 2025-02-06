import puppeteer from 'puppeteer';

export async function coletarPreco(url: string): Promise<number> {

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();

  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

  await page.goto(url, { waitUntil: 'domcontentloaded' });

  let precoTexto = '';

  if (url.includes('amazon.com.br')) {

    const precoInteiro = await page.$eval('.a-price-whole', (el: Element) => el.textContent?.trim() || '0');
    const precoCentavos = await page.$eval('.a-price-fraction', (el: Element) => el.textContent?.trim() || '00');
    precoTexto = `${precoInteiro}${precoCentavos}`;

  } else if (url.includes('kabum.com.br')) {

    await page.waitForSelector('.finalPrice', { timeout: 5000 });
    precoTexto = await page.$eval('.finalPrice', (el: Element) => el.textContent?.trim() || '');

    precoTexto = precoTexto.replace('R$', '').replace(/\u00A0/g, '').trim();

  }

  await browser.close();

  const precoTextoFormatado = precoTexto.replace('.', '').replace(',', '.');
  const preco = parseFloat(precoTextoFormatado);

  if (isNaN(preco) || preco <= 0) {
    throw new Error('Preço não encontrado');
  }

  return preco;
}