import * as bcrypt from 'bcryptjs';
describe('Crypto basico', () => {
  it('hash y compare funcionan', async () => {
    const hash = await bcrypt.hash('secret-123', 10);
    const ok = await bcrypt.compare('secret-123', hash);
    const fail = await bcrypt.compare('otro', hash);
    expect(ok).toBe(true);
    expect(fail).toBe(false);
  });
});
