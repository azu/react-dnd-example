// LICENSE : MIT
'use strict';
import React from 'react';
import CardItem,{PlayCardItem} from '../CardItem/CardItem';
import suitClassNames from 'suitcss-classnames';
import {DragLayer} from 'react-dnd';
class DragDropCardPreviewCreator {
    static create(component, collect) {
        return DragLayer(collect)(component);
    }
}

/**
 * 要素に対するマウスの位置の{x,y}差分を計算する
 * @param {{x:number, y:number} | null} initial
 * @param {{x:number, y:number} | null} current
 * @returns {{x: number, y: number}}
 */
function calcDiff(initial, current) {
    if (initial && current) {
        return {
            x: current.x - initial.x,
            y: current.y - initial.y
        };
    } else {
        return {x: 0, y: 0};
    }
}
/**
 * Previewコンポーネント内で参照できる値を返す
 * @param {TargetMonitor} monitor
 * @returns {{item, currentOffset: *, isDragging: *}}
 */
function previewCollect(monitor) {
    // この `item` は ドラッグしている CardItem のこと
    const item = monitor.getItem();

    /**
     * `item`要素のclientOffset(ドキュメント左上0,0とした値)
     * sourceが付くのは要素位置の情報
     * @type {{x:number, y:number} | null}
     */
    const initial = monitor.getInitialSourceClientOffset();
    /**
     * 現在のマウス位置の座標(ドキュメント左上0,0とした値)
     * source が付かないのはマウス位置の情報
     * @type {{x:number, y:number} | null}
     */
    const current = monitor.getSourceClientOffset();
    const diff = calcDiff(initial, current);
    return {
        item: item,
        currentOffset: diff,
        isDragging: monitor.isDragging()
    };
}

/**
 * x軸の計算をする
 * @param {{width: number, height: number}} cardSize
 * @param {{x: number, y: number}} currentOffset
 * @returns {{position: string, pointerEvents: string, transform: string, WebkitTransform: string}}
 */
function createStyle(cardSize, currentOffset) {
    // http://www.paulirish.com/2012/why-moving-elements-with-translate-is-better-than-posabs-topleft/
    const left = currentOffset.x;
    // const top = currentOffset.y;
    const transform = `translate3d(${left}px, ${0}px, 0)`;

    return {
        width: cardSize.width,
        height: cardSize.height,
        position: 'absolute',
        zIndex: 2,
        pointerEvents: 'none',
        left: `${left}px`,
        top: 0
    };
}

/**
 * マウスの位置が要素の中心となるように座標を計算する
 * padding-left + (マウス座標の{x,y} - 要素左上{x,y})
 * @param {number} paddingLeft
 * @param {{x: number, y:number}} offsetFromSourceInitial
 * @returns {{x: number, y:number}} currentOffset
 */
function correctOffset(paddingLeft, offsetFromSourceInitial) {
    return {
        x: paddingLeft + offsetFromSourceInitial.x,
        y: offsetFromSourceInitial.y
    };
}

/**
 * PreviewCartItemはドラッグ中のみ表示されるコンポーネント
 * 表示はCardItemと同じとなる
 */
class PreviewCartItem extends React.Component {
    static propTypes = {
        cardSize: React.PropTypes.shape({
            width: React.PropTypes.number.isRequired,
            height: React.PropTypes.number.isRequired
        }),
        id: React.PropTypes.string,
        text: React.PropTypes.string,
        currentOffset: React.PropTypes.shape({
            x: React.PropTypes.number,
            y: React.PropTypes.number
        }),
        isDragging: React.PropTypes.bool
    };

    render() {
        const className = suitClassNames({
            component: 'PreviewCartItem',
            states: {
                'is-hidden': !this.props.isDragging
            }
        });
        if (!this.props.isDragging) {
            return null;
        }
        // `previewCollect`がreturnしたオブジェクトがpropsとして手に入る。
        /**
         * @type {CardItem}
         */
        const item = this.props.item;
        const cardSize = this.props.cardSize;
        // 何番目の要素か
        const itemIndex = item.index;
        const leftPadding = cardSize.width * itemIndex;
        // マウスカーソルの位置に PreviewItemの中心 が来るようにする
        const currentPosition = correctOffset(leftPadding, this.props.currentOffset);
        // transformなスタイルを作成
        const style = createStyle(cardSize, currentPosition);
        let info = <div style={{ position: 'absolute', left: 0, top: 0, zIndex: 3 }}>
            {item.title}<br />
            dragging: {this.props.isDragging ? 'YES' : 'NO'}<br />
            diff: {`x: ${currentPosition && currentPosition.x}, y: ${currentPosition && currentPosition.y}`}<br />
            size: {`${cardSize && cardSize.width}x${cardSize && cardSize.height}<br />
            index:${item.index}`}
        </div>;
        return (
            <div className={className} style={style}>
                {info}
                <PlayCardItem
                    cardSize={cardSize}
                    id={item.id}
                    title={item.title}
                    thumbnailURL={item.thumbnailURL}
                />
            </div>
        );
    }
}

export default DragDropCardPreviewCreator.create(PreviewCartItem, previewCollect);
