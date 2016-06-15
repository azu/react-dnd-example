'use strict';
/**
 * D&DできるCardItemで共有する一意のキー
 * UseCaseやStoreで扱うPayloadの`type`と同じで、
 * D&Dする要素や領域はそれぞれ `type` を持ち、その`type`に対する挙動を定義している
 * (AとB領域は別のD&D空間であるといったことを実現できる)
 * @see http://gaearon.github.io/react-dnd/docs-overview.html
 * @type {string}
 */
export const CardType = 'CardType';

