export const IP = "";//http://localhost:8080/#/client_management/all?_k=hxu353
export const textAreaMaxLen = 3000;
export const pageSizeOptions = ['10', '20', '30', '50', '100'];
export const pwdRange = [6, 16];
export const logDefDay = 7;
export const CLIENTINNERNAV = [
    {
        'name': "全部客户", "id": "1", "url": "/client_management/all"
    },
    {
        'name': "个人实名认证申请",
        "id": "2",
        "url": "/client_management/personal"
    },
    {
        'name': "企业实名认证申请", "id": "3", "url": "/client_management/enterprise"
    }
];
export const MESSAGENNERNAV = [
    {
        'name': "消息模块管理", "id": "1", "url": "/client_message/all"
    },
    {
        'name': "消息发送方式管理",
        "id": "2",
        "url": "/client_message/send"
    }
];
export const CLIENTTAB = ["基本信息", "密钥管理", "待审核信息", "客户日志"];
export const PRODUCTTYPE = {"0": "未开通", "1": "云存储", "2": "云解析", "3": "CDN"};
export const SERVICETYPE = {"1": "账户与权限", "2": "对象存储", "3": "自定义数据处理", "4": "多媒体处理", "5": "云解析", "6": "CDN"};
export const CHECKTYPE = {"0": "待审核", "1": "通过", "2": "未通过"};
export const CHECKSTUTUS = {"1": "启用", "2": "通过", "0": "禁用"};
export const CLIENTTYPE = {"1": "个人", "2": "企业", "3": "未实名认证"};
export const APPLAYTYPE = {"1": "个人", "2": "企业", "3": "未申请"};
export const AUTHENTICATETYPE = {"1": "社会信用代码认证", "2": "营业执照认证", "3": "非盈利组织认证"};
export const KEYSTATUS = {"0": "已停用", "1": "使用中"};
export const MESSAGETYPE = {"1": "账户消息", "2": "产品消息"};
export const EVENTTYPE = {
    "1": ["账户登录通","登录密码修改","登录邮箱修改","绑定手机号变更","账户冻结状态提醒","身份认证审核通知"],
    "2": ["域名被冻结，不能正常解析/域名解冻，恢复正常解析", "解析异常"]
};
export const SENDWAYS = {"1": "站内信", "2": "邮件", "3": "短信"};
//export const SENDWAYSARR = [{"id": "", "name": ""}];
export function add0(m) {
    return m < 10 ? '0' + m : m
}
export function formatDataTime(shijianchuo, str) {
    var str = !str ? "-" : str;
    var time = new Date(parseInt(shijianchuo) * 1000),
        y = time.getFullYear(),
        m = time.getMonth() + 1,
        d = time.getDate(),
        h = time.getHours(),
        mm = time.getMinutes(),
        s = time.getSeconds();
    return String(y) + str + add0(m) + str + add0(d) + " " + add0(h) + ":" + add0(mm) + ":" + add0(s);
}
export function passwordReg(value) {
    var patt = /^\S{6,16}$/;
    if (value == '') {
        return true;
    } else {
        if (patt.test(value)) {
            var arr = [/[A-Z]+/, /[a-z]+/, /[0-9]+/, /[^\sa-zA-Z0-9]+/];
            var n = 0;
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].test(value)) {
                    n++;
                }
            }
            if (n >= 3) {
                return true;
            }
        }
    }
    return false;
}
export const phoneReg = /^(1[34578]\d{9})|((\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14})$/;
export const mobPhoneReg = /^1[34578]\d{9}$/;
export const telPhoneReg = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/;
export const IPREG= /^(((?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))|(((?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))+))$/;
export const EMAILREG=/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
export const emailOrPhoneReg= /(^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$)|(^1[34578]\d{9}$)/;


//chkData list chkData
//choseData //clear chkData=choseData