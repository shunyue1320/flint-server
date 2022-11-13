import axios from "axios";
import rax from "retry-axios";

export const ax = axios.create();
ax.defaults.raxConfig = {
    instance: ax,
};
// 默认失败重复3次
rax.attach(ax);
