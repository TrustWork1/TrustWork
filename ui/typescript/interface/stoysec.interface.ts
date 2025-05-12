export interface StoryCardList {
  number: string;
  title: string;
  content: string;
}

export interface StorySecProps {
  image: string;
  title: string;
  children: React.JSX.Element | React.JSX.Element[];
  cardList: StoryCardList[];
}
