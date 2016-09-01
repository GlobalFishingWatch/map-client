import { Accordion } from 'react-sanfona';
import { scrollTo } from './Utils';

const arrayify = obj => [].concat(obj);

class AccordionGF extends Accordion {
  componentWillReceiveProps(nextProps) {
    if ((JSON.stringify(arrayify(nextProps.activeItems).sort()) !== JSON.stringify(arrayify(this.state.activeItems).sort()))) {
      this.handleClick(nextProps.activeItems);
    }
  }

  componentDidMount() {
    const el = document.getElementsByClassName('react-sanfona-item-expanded');
    if(!el.length > 0) return;
    scrollTo(el);
  }

  // disabled temporaly
  // componentDidUpdate() {
  //   console.log('componentDidUpdate');
  //   const el = document.getElementsByClassName('react-sanfona-item-expanded');
  //   if(!el.length > 0) return;
  //
  //   // adds timeout to give time to the accordion to close last item-title
  //   // and recalculate height properly
  //   setTimeout(() => scrollTo(el), 300);
  // }
}

export default AccordionGF;
