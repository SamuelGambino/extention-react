import browser from "webextension-polyfill";
import { BaseParser } from "./BaseParser";
import type { ParserState } from "../../globalTypes/parsing_state";
import type { Product } from "../types/ExportTypes";
import { getToken, setToken } from "../storage";
import type { PresetVk } from "../../globalTypes/parser_сonfig";
import type { fullResponse, VkItemsResp } from "../types/VkParserTypes";

export class Vk extends BaseParser {
  private token: string = '';
  private apiVersion: string = '5.199';
  private responseData: fullResponse = { categories: [], items: [] };

  async authVk() {
    await this.setLog({ status: "warn", title: "[VK]:Auth", value: "Авторизация в ВК..." });

    const STORAGE_KEY = "vk_access_token";
    const ONE_HOUR_MS = 55 * 60 * 1000;

    const storageData = await getToken(STORAGE_KEY);
    if (storageData) {
      const now = Date.now();

      if (now < storageData.expiresAt) {
        await this.setLog({ status: "success", title: "[VK]:Auth", value: "Токен валиден еще " + new Date(storageData.expiresAt - now) });
        this.token = storageData.token;
        return;
      }
      await this.setLog({ status: "warn", title: "[VK]:Auth", value: "Токен не валиден, повторная авторизация..." });
    }

    try {
      await this.setLog({ status: "warn", title: "[VK]:Auth", value: "Открытие вкладки авторизации..." });
      const tab = await browser.tabs.create({
        url: "https://oauth.vk.com/authorize?client_id=6006423&redirect_uri=https://export.vk.foodsoul.pro&scope=market&response_type=token&v=5.131&state=123456"
      });

      const tabId = tab.id;
      if (!tabId) {
        throw new Error("Не удалось получить ID созданной вкладки");
      }

      return new Promise<string>((resolve) => {
        const listener = async (updatedTabId: number, changeInfo: any) => {
          if (updatedTabId === tabId && changeInfo.url?.startsWith("https://export.vk.foodsoul.pro/#")) {
            const tokenMatch = changeInfo.url.match(/access_token=([^&]+)/);
            if (tokenMatch) {
              const token = tokenMatch[1];
              await this.setLog({ status: "success", title: "[VK]:Auth", value: "Получен токен" });

              const expiresAt = Date.now() + ONE_HOUR_MS;
              await setToken(STORAGE_KEY, { token, expiresAt });
              this.token = token;

              browser.tabs.remove(tabId);
              browser.tabs.onUpdated.removeListener(listener);
              resolve(token);
            }
          }
        };

        browser.tabs.onUpdated.addListener(listener);
      });
    } catch (e) {
      await this.setLog({ status: "danger", title: "[VK]:Auth", value: "Ошибка при авторизации: " + e });
    }
  }

  async callVkApi(method: string, params = {}) {
    const groupId = this.config.data as PresetVk;
    const query = new URLSearchParams({
      access_token: this.token,
      v: this.apiVersion,
      owner_id: `-${groupId}`,
      ...params
    });
    const url = `https://api.vk.com/method/${method}?${query.toString()}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      throw new Error(`VK API error: ${data.error.error_msg}`);
    }
    return data.response;
  }

  async getProductsByCategory(catId: number) {
    const response = await this.callVkApi('market.get', {
      album_id: catId,
      count: 200,
      extended: 1
    });

    if (!response.items || response.items.length === 0) throw Error("Пустой товет на запрос товаров категории " + this.categories.find(cat => { if (catId === cat.id) return cat.name }));

    return response.items.map((item: VkItemsResp) => ({
      product_id: item.id,
      name: item.title,
      picture: item.thumb_photo || '',
      description: item.description || '',
      category: catId,
      price: [{
        id: item.id,
        price: item.price?.amount ? Number(item.price.amount) / 100 : 0,
        index: [1, 1]
      }],
      modifiers: []
    }));
  }

  async checkAvailability() {
    await this.setLog({ status: "warn", title: "[VK]:Check", value: "Получение метаданных..." });

    try {
      await this.setLog({ status: "warn", title: "[VK]:Check", value: "Запрос на api..." });
      const response = await this.callVkApi('market.getAlbums');
      this.responseData.categories = await response.json().items;
    } catch (e) {
      await this.setLog({ status: "danger", title: "[VK]:Check", value: "Ошиюка при запросе категорий - " + e });
    }
    try {
      await this.setLog({ status: "warn", title: "[VK]:Check", value: "Запрос на api..." });
      const response = await this.callVkApi('market.get', {
        count: 200,
        extended: 1
      });
      this.responseData.items = await response.json().items;
    } catch (e) {
      await this.setLog({ status: "danger", title: "[VK]:Check", value: "Ошиюка при запросе товаров - " + e });
    }
    const meta = {
      categoriesTotal: this.responseData.categories.length,
      productsTotal: this.responseData.items.length
    };
    await this.setDataState(meta as Partial<ParserState['data']>);

    await this.setLog({ status: "success", title: "[VK]:Check", value: "Получены метаданные" });
  }

  async parseRest() {
    this.categories = [
      { id: 1000, name: 'Без категории', parent: 0 }
    ];

    try {
      if (this.responseData.categories && this.responseData.categories.length) {
        this.responseData.categories.forEach(album => {
          this.categories.push({
            id: album.id,
            name: album.title,
            parent: 0
          });
        });
      }

      await this.setLog({ status: "success", title: "[YandexEda]:Parse", value: "Обработаны категории" });
    } catch (err) {
      await this.setLog({ status: "danger", title: "[YandexEda]:Parse", value: 'Ошибка обработке категорий: ' + err });
    }
    await this.waitForNextStep();

    const allProducts: Product[] = [];
    try {
      this.responseData.items.forEach(item => {
        allProducts.push({
          product_id: item.id,
          name: item.title,
          picture: item.thumb_photo || '',
          description: item.description || '',
          category: 1000,
          price: [{
            id: item.id,
            price: item.price?.amount ? Number(item.price.amount) / 100 : 0,
            index: [1, 1]
          }],
          modifiers: []
        })
      });

      await this.setLog({ status: "success", title: "[YandexEda]:Parse", value: "Обработаны все товары" });
    } catch (e) {
      await this.setLog({ status: "danger", title: "[YandexEda]:Parse", value: 'Ошибка обработке всех товаров: ' + e });
    }
    await this.waitForNextStep();

    const productsInAlbums = new Set();

    try {
      for (const cat of this.categories) {
        if (cat.id === 1000) continue;

        const catProducts = await this.getProductsByCategory(cat.id);

        catProducts.forEach((prod: Product) => {
          this.products.push(prod);
          productsInAlbums.add(prod.product_id);
        });

        await this.sleep(400);
      }
      await this.setLog({ status: "success", title: "[YandexEda]:Parse", value: "Обработаны товары по категориям" });
    } catch (e) {
      await this.setLog({ status: "danger", title: "[YandexEda]:Parse", value: 'Ошибка обработке товаров по категориям: ' + e });
    }

    const uncategorizedProducts = allProducts
      .filter(p => !productsInAlbums.has(p.product_id))
      .map(p => ({
        ...p,
        category: 1000
      }));

    await this.setLog({ status: "success", title: "[YandexEda]:Parse", value: "Парсинг завершен" });
    this.products.push(...uncategorizedProducts);
  }
}