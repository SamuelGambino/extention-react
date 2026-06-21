import browser from "webextension-polyfill";
import type { ExportData } from "./types/ExportTypes";
import type { ParserTabConfig } from "../globalTypes/parser_сonfig";
import { getState, setState } from "./storage";

export class Exporter {
  async export(data: ExportData, config: ParserTabConfig) {
    const { categories, products, modifiers_groups, modifiers } = data;

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += `<fs_catalog date="${this.getDate()}">\n`;
    xml += `  <shop>\n`;
    xml += `    <name>https://eda.yandex.ru</name>\n`;
    xml += `    <company>https://eda.yandex.ru</company>\n`;
    xml += `    <url>https://eda.yandex.ru</url>\n`;
    xml += `    <currencies>\n`;
    xml += `      <currency id="RUR" rate="1" />\n`;
    xml += `    </currencies>\n`;

    // ====== МОДИФИКАТОРНЫЕ ГРУППЫ ======
    xml += `    <modifiersGroups>\n`;
    for (const group of modifiers_groups) {
      // modifiers_groups.forEach(group => {
      xml += `      <modifiersGroup id="${group.id}">\n`;
      xml += `        <name>${this.escapeXml(group.name)}</name>\n`;
      xml += `        <type>${group.type}</type>\n`;
      xml += `        <minimum>${group.minimum}</minimum>\n`;
      xml += `        <maximum>${group.maximum}</maximum>\n`;
      xml += `      </modifiersGroup>\n`;
    };
    xml += `    </modifiersGroups>\n`;

    // ====== МОДИФИКАТОРЫ ======
    xml += `    <modifiers>\n`;
    for (const modifier of modifiers) {
      // modifiers.forEach(modifier => {
      xml += `      <modifier id="${modifier.id}">\n`;
      xml += `        <name>${this.escapeXml(modifier.name)}</name>\n`;
      xml += `        <price>${modifier.price}</price>\n`;
      xml += `        <modifiersGroupId>${modifier.group_id}</modifiersGroupId>\n`;
      xml += `      </modifier>\n`;
    };
    xml += `    </modifiers>\n`;

    // ====== КАТЕГОРИИ ======
    xml += `    <categories>\n`;
    categories.forEach(cat => {
      xml += `      <category id="${cat.id}">${this.escapeXml(cat.name)}</category>\n`;
    });
    xml += `    </categories>\n`;

    // ====== ТОВАРЫ ======
    xml += `    <offers>\n`;
    products.forEach(prod => {
      xml += `      <offer id="${prod.product_id}">\n`;
      xml += `        <name>${this.escapeXml(prod.name)}</name>\n`;
      xml += `        <description><![CDATA[${prod.description || ''}]]></description>\n`;
      xml += `        <picture>${prod.picture || ''}</picture>\n`;

      // --- параметры ---
      xml += `        <parameters>\n`;
      prod.price.forEach((price) => {
        xml += `          <parameter id="${price.id}">\n`;
        xml += `            <price>${price.price}</price>\n`;
        xml += `            <description>${price.index[0]}</description>\n`;
        xml += `            <descriptionIndex>${price.index[1]}</descriptionIndex>\n`;
        xml += `          </parameter>\n`;
      });
      xml += `        </parameters>\n`;

      xml += `        <categoryId>${prod.category}</categoryId>\n`;

      // --- группы модификаторов ---
      if (prod.modifiers?.length) {
        xml += `        <modifiersGroupsIds>\n`;
        prod.modifiers.forEach(mid => {
          xml += `          <modifiersGroupId>${mid}</modifiersGroupId>\n`;
        });
        xml += `        </modifiersGroupsIds>\n`;
      }

      xml += `      </offer>\n`;
    });
    xml += `    </offers>\n`;

    xml += `  </shop>\n`;
    xml += `</fs_catalog>`;

    const state = await getState();
    await setState({
      ...state,
      parsing: { ...state.parsing, ...{ isRunning: false } }
    });
    this.download(xml, `${config.type}_${config.tabName ?? ""}`)
  }

  protected getDate() {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
  }

  protected escapeXml(str: string): string {
    if (!str) return '';

    return str.replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case '<':
          return '&lt;';
        case '>':
          return '&gt;';
        case '&':
          return '&amp;';
        case "'":
          return '&apos;';
        case '"':
          return '&quot;';
        default:
          return c;
      }
    });
  }

  protected async download(xml: string, filename: string) {
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);

    try {
      const downloadId = await browser.downloads.download({
        url,
        filename,
        saveAs: true,
      });

      console.log('Download started:', downloadId);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      URL.revokeObjectURL(url);
    }
  }
}