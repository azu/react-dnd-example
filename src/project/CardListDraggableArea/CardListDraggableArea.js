'use strict';
import React from 'react';
import {DragDropContext} from 'react-dnd';
// Mouseで動作するために必要なDnDバックエンド
import createTouchBackend from 'react-dnd-touch-backend';
// HTML5バックエンドはPointer Eventsを利用しているためIEなどで動かない
// import ReactDnDHTML5Backend from "react-dnd-html5-backend";
export class DragDropContextCreator {
    /**
     * D&Dを可能にする領域となるComponentを作る高階関数
     * @param {React.Component} componentTobeDnD
     * @returns {React.Component} D&Dが可能なReact.Componentを返す
     */
    static create(componentTobeDnD) {
        const touchBackend = createTouchBackend({enableMouseEvents: true});
        const dragDropMap = DragDropContext(touchBackend);
        return dragDropMap(componentTobeDnD);
    }
}


class CardListDraggableArea extends React.Component {
    static propTypes = {
        children: React.PropTypes.node.isRequired
    };

    constructor() {
        super();
        this._wrapper = null;
    }

    render() {
        return <div className="CardListDraggableArea" ref={(e) => this._wrapper = e}>
            {React.Children.only(this.props.children)}
        </div>;
    }
}
export default DragDropContextCreator.create(CardListDraggableArea);
