import React from "react";
import classnames from "classnames";
import {
  MDCTopAppBarFoundation,
  MDCFixedTopAppBarFoundation,
  MDCShortTopAppBarFoundation
} from "@material/top-app-bar";
import PropTypes from "prop-types";

export default class TopAppBar extends React.Component {
  constructor(props) {
    super(props);
    this.topAppBarElement = React.createRef();
  }

  state = {
    classList: new Set(),
    style: {}
  };

  foundation_ = null;

  componentDidMount() {
    this.initializeFoundation();
  }

  componentWillUnmount() {
    this.foundation_.destroy();
  }

  initializeFoundation = () => {
    if (this.props.short) {
      this.foundation_ = new MDCShortTopAppBarFoundation(this.adapter);
    } else if (this.props.fixed) {
      this.foundation_ = new MDCFixedTopAppBarFoundation(this.adapter);
    } else {
      this.foundation_ = new MDCTopAppBarFoundation(this.adapter);
    }

    this.foundation_.init();
  };

  get classes() {
    const { classList } = this.state;
    const { alwaysCollapsed, className, short, fixed, prominent } = this.props;

    return classnames("mdc-top-app-bar", Array.from(classList), className, {
      "mdc-top-app-bar--fixed": fixed,
      "mdc-top-app-bar--short": short,
      "mdc-top-app-bar--short-collapsed": alwaysCollapsed,
      "mdc-top-app-bar--prominent": prominent
    });
  }

  get adapter() {
    const { actionItems } = this.props;

    return {
      hasClass: className => this.classes.split(" ").includes(className),
      addClass: className =>
        this.setState({ classList: this.state.classList.add(className) }),
      removeClass: className => {
        const { classList } = this.state;
        classList.delete(className);
        this.setState({ classList });
      },
      setStyle: this.setStyle,
      getTopAppBarHeight: () => this.topAppBarElement.current.clientHeight,
      registerScrollHandler: handler =>
        window.addEventListener("scroll", handler),
      deregisterScrollHandler: handler =>
        window.removeEventListener("scroll", handler),
      registerResizeHandler: handler =>
        window.addEventListener("resize", handler),
      deregisterResizeHandler: handler =>
        window.removeEventListener("resize", handler),
      getViewportScrollY: () => window.pageYOffset,
      getTotalActionItems: () => actionItems && actionItems.length
    };
  }

  setStyle = (varName, value) => {
    const updatedStyle = Object.assign({}, this.state.style);
    updatedStyle[varName] = value;
    this.setState({ style: updatedStyle });
  };

  renderActionItems() {
    const { actionItems } = this.props;
    if (!actionItems) {
      return;
    }

    return (
      <section
        className="mdc-top-app-bar__section mdc-top-app-bar__section--align-end"
        role="toolbar"
      >
        {/* need to clone element to set key */}
        {actionItems.map((item, key) => React.cloneElement(item, { key }))}
      </section>
    );
  }

  getMergedStyles = () => {
    const { style } = this.props;
    const { style: internalStyle } = this.state;
    return Object.assign({}, internalStyle, style);
  };

  render() {
    const { title, navIcon } = this.props;

    return (
      <header
        className={this.classes}
        style={this.getMergedStyles()}
        ref={this.topAppBarElement}
      >
        <div className="mdc-top-app-bar__row">
          <section className="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
            {navIcon ? navIcon : null}
            <span className="mdc-top-app-bar__title">{title}</span>
          </section>
          {this.renderActionItems()}
        </div>
      </header>
    );
  }
}

TopAppBar.propTypes = {
  alwaysCollapsed: PropTypes.bool,
  short: PropTypes.bool,
  fixed: PropTypes.bool,
  prominent: PropTypes.bool,
  title: PropTypes.string,
  actionItems: PropTypes.arrayOf(PropTypes.element),
  navIcon: PropTypes.element
};

TopAppBar.defaultProps = {
  alwaysCollapsed: false,
  short: false,
  fixed: false,
  prominent: false,
  title: "",
  actionItems: null,
  navIcon: null
};
