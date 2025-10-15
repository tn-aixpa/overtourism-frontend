import { EmptyFieldPipe } from './empty-field.pipe';

describe('EmptyFieldPipe', () => {
  it('create an instance', () => {
    const pipe = new EmptyFieldPipe();
    expect(pipe).toBeTruthy();
  });
});
