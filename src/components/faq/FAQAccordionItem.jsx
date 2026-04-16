import Accordion from '../ui/Accordion';

export default function FAQAccordionItem({ question, answer }) {
  return <Accordion question={question} answer={answer} />;
}
