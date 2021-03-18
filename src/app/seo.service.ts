import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

export interface TypingSEO {
  title?: string;
  titleSuffix?: string;
  description?: string;
  image?: string;
  keywords?: string;
  url?: string;
}
export interface TypingProperty {
  property: string;
  itemprop?: string;
  content: string;
}
export interface TypingName {
  name: string;
  itemprop?: string;
  content: string;
}

@Injectable()
export class SeoService {

  baseUrl: string = "https://app.adafri.com";

  constructor(
    private ngMeta: Meta,
    private ngTitle: Title
  ) { }

  get metaInstance(): Meta {
    return this.ngMeta;
  }

  /**
   * @description Set General SEO Tags
   * @param config: TypingSEO
   * @return void
   */
  setTags(config: TypingSEO): void {
    if (config.title !== undefined) {
      this.title(config.title, config.titleSuffix);
    }
    if (config.description !== undefined) {
      this.description(config.description);
    }
    if (config.image !== undefined) {
      this.image(config.image);
    }
    if (config.keywords !== undefined) {
      this.keywords(config.keywords);
    }
    if (config.url !== undefined) {
      this.url(config.url);
    }
  }

  /**
   * @description Set Name Tag
   * @param name: TypingName
   * @param content
   * @return void
   */
  setNameTag(name: TypingName): void {
    const property = {
      name: name.name,
      content: name.content,
    };
    if (name.itemprop !== undefined && name.itemprop !== '') {
      property['itemprop'] = name.itemprop;
    }
    if (this.ngMeta.getTag(`name="${property.name}"`)) {
      this.ngMeta.updateTag(property);
    } else {
      this.ngMeta.addTag(property);
    }
  }

  /**
   * @description Set Name Tags
   * @param names: [TypingName]
   * @return void
   */
  setNameTags(names: [TypingName]): void {
    names.forEach(prop => {
      this.setNameTag(prop);
    });
  }

  /**
   * @description Set Property Tag
   * @param prop: TypingProperty
   * @param content
   * @return void
   */
  setPropertyTag(prop: TypingProperty): void {
    const property = {
      property: prop.property,
      content: prop.content,
    };
    if (prop.itemprop !== undefined && prop.itemprop !== '') {
      property['itemprop'] = prop.itemprop;
    }
    if (this.ngMeta.getTag(`property="${property.property}"`)) {
      this.ngMeta.updateTag(property);
    } else {
      this.ngMeta.addTag(property);
    }
  }

  /**
   * @description Set Property Tags
   * @param props: [TypingProperty]
   * @return void
   */
  setPropertyTags(props: [TypingProperty]): void {
    props.forEach(prop => {
      this.setPropertyTag(prop);
    });
  }

  /**
   * @description Set URL Tag
   * @param content: string
   * @return void
   */
  url(content: string): void {
    this.ngMeta.updateTag({ property: 'og:url', itemprop: 'url', content: `${this.baseUrl}${content}` });
  }

  /**
   * @description Set Title Tag
   * @param title: string
   * @param titleSuffix: string
   * @return void
   */
  title(title: string, titleSuffix?: string): void {
    const setTitle = (titleSuffix !== undefined && titleSuffix !== '') ? `${title} ${titleSuffix}` : title;
    this.ngTitle.setTitle(setTitle);
    this.setPropertyTag({ property: 'og:title', itemprop: 'title', content: setTitle });
    this.setPropertyTag({ property: 'twitter:title', itemprop: 'title', content: setTitle });
  }

  /**
   * @description Set Description Tag
   * @param content: string
   * @return void
   */
  description(content: string): void {
    this.setNameTag({ name: 'description', itemprop: 'description', content: content });
    this.setPropertyTag({ property: 'og:description', itemprop: 'description', content: content });
    this.setPropertyTag({ property: 'twitter:description', itemprop: 'description', content: content });
  }

  /**
   * @description Set Image Tag
   * @param content: string
   * @return void
   */
  image(content: string): void {
    this.setPropertyTag({ property: 'twitter:image', itemprop: 'image', content: content });
    this.setPropertyTag({ property: 'og:image', itemprop: 'image', content: content });
    this.setPropertyTag({ property: 'og:image:secure_url', itemprop: 'image', content: content });
  }

  /**
   * @description Set Keywords Tag
   * @param content: string
   * @return void
   */
  keywords(content: string): void {
    this.setNameTag({ name: 'keywords', itemprop: 'keywords', content: content });
  }

}