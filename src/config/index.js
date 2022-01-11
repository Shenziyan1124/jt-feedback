import defaultConfig from './default.config';
import devConfig from './dev.config';
import testConfig from './test.config';
import productConfig from './product.config';

// 代理的环境配置
export const proxyEnv = 'dev';

function getConfig() {
  return { defaultConfig, devConfig, testConfig, productConfig }[`${proxyEnv}Config`] || defaultConfig;
}
export default getConfig();
