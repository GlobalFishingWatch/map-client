import { Accordion } from 'react-sanfona';
import { scrollTo } from './Utils';

class AccordionGF extends Accordion {
  componentWillReceiveProps(nextProps) {
    if (nextProps.activeItems !== this.state.activeItems) {
      this.setState({ activeItems: nextProps.activeItems });
    }
  }

  componentDidMount() {
    const el = document.getElementsByClassName('react-sanfona-item-expanded');
    if(!el.length > 0) return;
    scrollTo(el);
  }
  componentDidUpdate() {
    const el = document.getElementsByClassName('react-sanfona-item-expanded');
    if(!el.length > 0) return;

    // adds timeout to give time to the accordion to close last item-title
    // and recalculate height properly
    setTimeout(() => scrollTo(el), 300);
  }
}

export default AccordionGF;
