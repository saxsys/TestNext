import { TestNextPage } from './app.po';

describe('test-next App', () => {
  let page: TestNextPage;

  beforeEach(() => {
    page = new TestNextPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
