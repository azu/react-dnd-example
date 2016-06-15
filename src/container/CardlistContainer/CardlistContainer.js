// LICENSE : MIT
'use strict';
import React from 'react';
import suitClassNames from 'suitcss-classnames';
import CardList from '../../project/CardList/CardList';
import CardListDraggableArea from '../../project/CardListDraggableArea/CardListDraggableArea';
class CardListContainer extends React.Component {
    constructor() {
        super();
        /**
         * Card(D&Dできる要素)のサイズ
         * 衝突判定のためのサイズもかねているので、CSSのスタイルではないのかも
         * @type {{width: number, height: number}}
         */
        this.cardSize = {
            width: 170,
            height: 130
        };


        this.boundSwap = this._onSwap.bind(this);
        this.state = {
            items: [
                {
                    id: "1",
                    title: "Test 1",
                    thumbnailURL: "http://placehold.jp/100x100.png"
                },
                {
                    id: "2",
                    title: "Test 2",
                    thumbnailURL: "http://placehold.jp/100x100.png"
                },
                {
                    id: "3",
                    title: "Test 3",
                    thumbnailURL: "http://placehold.jp/100x100.png"
                }
            ]
        }
    }

    render() {
        const className = suitClassNames({
            component: 'CardListContainer',
            states: {
                'is-explorer': this.props.isExplorer
            }
        });
        return <div className={className}>
            <CardListDraggableArea>
                <CardList
                    items={this.state.items}
                    cardSize={this.cardSize}
                    onSwap={this.boundSwap}
                />
            </CardListDraggableArea>
        </div>;
    }

    /**
     * @param {Object} sourceItem ドラッグ元アイテム
     * @param {Object} targetItem ドラップ先アイテム
     * @private
     */
    _onSwap(sourceItem, targetItem) {
        const items = this.state.items;
        const sourceIndex = items.findIndex((item) => item.id === sourceItem.id);
        const targetIndex = items.findIndex((item) => item.id === targetItem.id);
        console.log("Swap:", sourceIndex, targetIndex);
        // どちらか片方でも見つからない場合は交換しない
        if (sourceIndex === -1 || targetIndex === -1) {
            return;
        }
        const tmp = items[sourceIndex];
        items[sourceIndex] = items[targetIndex];
        items[targetIndex] = tmp;
        this.setState({
            items
        });
    }
}


export default CardListContainer;
