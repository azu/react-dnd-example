import React from 'react';
import flow from 'lodash.flow';
import {DropTarget, DragSource} from 'react-dnd';
import {CardType} from '../CardType';
import {findDOMNode} from 'react-dom';
import CardItem from "./CardItem";
// ドラッグ元としての動作を定義する
// CardItemをDrag元とした時の処理
const sourceCollector = (connect, monitor) => {
    // TargetはMonitorによって、現在D&DされているSourceとの関係性を取れる
    // React DnD http://gaearon.github.io/react-dnd/docs-drop-target-monitor.html
    // ここで返したオブジェクトは props として参照できる
    return {
        connectDragSource: connect.dragSource(),
        connectDragPreview: connect.dragPreview(),
        isDragging: monitor.isDragging()
    };
};
const dragSource = DragSource(CardType, {
    beginDrag(props) {
        return props;
    },
    isDragging: function (props, monitor) {
        // If your component gets unmounted while dragged
        // (like a card in Kanban board dragged between lists)
        // you can implement something like this to keep its
        // appearance dragged:
        return monitor.getItem().id === props.id;
    }
}, sourceCollector);
// ドラッグ先としての動作を定義する
// CardItemをDrop先として時の処理
const targetCollector = (connect, monitor) => {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver()
    };
};
const dragTarget = DropTarget(CardType, {
    hover(props, monitor, component) {
        const item = monitor.getItem();
        const dragSourceIndex = item.index;
        const hoverTargetIndex = props.index;
        if (props.id === item.id) {
            return;
        }
        // ドラッグ先CardItemの実際のDOM要素の情報を取得する
        const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();
        // ドラッグ先CardItemの半分の幅を取る
        const hoverMiddleX = hoverBoundingRect.width / 2;
        // マウスの{x,y}座標を取得
        const clientOffset = monitor.getClientOffset();
        const hoverClientX = clientOffset.x - hoverBoundingRect.left;
        // Dragging downwards
        // マウスが要素の真ん中より左にある場合は何もしない
        if (dragSourceIndex < hoverTargetIndex && hoverClientX < hoverMiddleX) {
            return;
        }
        // マウスが要素の真ん中より右にある場合は何もしない
        if (dragSourceIndex > hoverTargetIndex && hoverClientX > hoverMiddleX) {
            return;
        }
        // マウスが要素の真ん中よりちょうど重なったタイミングで onSwap 呼ぶ
        // 何度も`onSwap`が連続して呼ばれないようにするため重なったタイミングのみ呼び出す
        item.onSwap(item, props);
    }
}, targetCollector);
// CardはDrop元であり、Drop先でもある
// dragTarget + dragSourceを合成する
const cardMixedSource = flow(dragTarget, dragSource);
/*
    Itemをドラッグ可能にした状態にするコンポーネント
 */
class CardItem extends React.Component {
    static propTypes = {
        // react-dnd props
        connectDragSource: React.PropTypes.func.isRequired,
        connectDropTarget: React.PropTypes.func.isRequired,
        connectDragPreview: React.PropTypes.func.isRequired
    };

    render() {
        let content = <div className="CardItem">
            <CardItem {...this.props}/>
        </div>;
        content = this.props.connectDragSource(content, {dropEffect: 'move'});
        // Connect as drop target
        content = this.props.connectDropTarget(content);
        // Connect to drag layer
        content = this.props.connectDragPreview(content);
        return content;
    }
}

// connectDropTarget, connectDragSource, connectDragPreview
export default cardMixedSource(CardItem);
