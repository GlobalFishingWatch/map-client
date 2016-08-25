import { Accordion } from 'react-sanfona';

class AccordionGF extends Accordion {
  componentWillReceiveProps(nextProps) {
    if (nextProps.activeItems !== this.state.activeItems) {
      this.setState({ activeItems: nextProps.activeItems });
    }
  }
}

export default AccordionGF;
