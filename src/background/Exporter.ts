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
    xml += `    <name>${config.tabName ?? config.type}</name>\n`;
    xml += `    <url>${config.source}</url>\n`;

    // ====== МОДИФИКАТОРНЫЕ ГРУППЫ ======
    xml += `    <modifiersGroups>\n`;
    for (const group of modifiers_groups) {
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
        if (price.proteins) {
          xml += `            <proteins>${price.proteins}</proteins>\n`;
        }
        if (price.fats) {
          xml += `            <fats>${price.fats}</fats>\n`;
        }
        if (price.carbohydrates) {
          xml += `            <carbohydrates>${price.carbohydrates}</carbohydrates>\n`;
        }
        if (price.calories) {
          xml += `            <calories>${price.calories}</calories>\n`;
        }
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
      parsing: { ...state.parsing, isRunning: false }
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
    const url = `data:application/xml;charset=utf-8,${encodeURIComponent(xml)}`;
    const safeFilename = filename.endsWith('.xml') ? filename : `${filename}.xml`;

    try {
      const downloadId = await browser.downloads.download({
        url,
        filename: safeFilename,
        saveAs: true,
      });

      console.log('Download started:', downloadId);
    } catch (error) {
      console.error('Download failed:', error);
    }
  }
}