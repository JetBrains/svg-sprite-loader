import React, {PureComponent} from 'react';

export default class Icon extends PureComponent {
  render() {
    const {className, glyph, width, height, ...restProps} = this.props;
    const viewBox = `0 0 ${width} ${height}`;

    return (
      <svg className={className} viewBox={viewBox} {...restProps}>
        <use xlinkHref={`#${glyph}`} />
      </svg>
    );
  }
}

Icon.defaultProps = {
  glyph: '',
  width: 16,
  height: 16,
  className: 'icon'
};
