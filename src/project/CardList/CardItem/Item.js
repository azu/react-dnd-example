import React from 'react';
import suitClassNames from 'suitcss-classnames';
/*
 CardのViewそのもの
 ドラッグ可能な要素に埋め込まれて使う
 Preview側もこの要素を再利用する
 */
export default class Item extends React.Component {
    static propTypes = {
        cardSize: React.PropTypes.shape({
            width: React.PropTypes.number.isRequired,
            height: React.PropTypes.number.isRequired
        }),
        // ドラッグ元のCard が ドラッグ先のCardに乗った時に呼ばれる
        onSwap: React.PropTypes.func,
        isDragging: React.PropTypes.bool,
        isOver: React.PropTypes.bool,
        // DnD側の比較がShallowEqualであるためそれぞれの情報は展開して渡す
        id: React.PropTypes.string.isRequired,
        title: React.PropTypes.string.isRequired,
        thumbnailURL: React.PropTypes.string.isRequired
    };

    constructor() {
        super();
        this.boundOnClick = this._onClick.bind(this);
    }

    render() {
        // cardのsizeをそのままstyleとして適応する
        const cardSizeStyle = this.props.cardSize;
        // `size`が衝突判定に必要
        const className = suitClassNames({
            component: 'Item',
            states: {
                'is-over': this.props.isOver,
                'is-dragging': this.props.isDragging
            }
        });
        const {title, thumbnailURL} = this.props;
        let content = <div className={className} style={cardSizeStyle} onClick={this.boundOnClick}>
            <img className="Item-thumbnail" src={thumbnailURL}/>
            <h3 className='Item-title'>{title}</h3>
        </div>;
        return content;

    }

    /**
     * @param {Event} event
     * @private
     */
    _onClick(event) {
        if (typeof this.props.onClick === 'function') {
            this.props.onClick(event);
        }
    }
}
