<template>
    <zm-container>
        <zm-main ref="containerMain" class="zm-main-2">
            <div class="mint-field top-div">
                <zm-datetime-picker format="yyyy-MM-dd"
                                    :content.sync="pickerVisible"
                                    type="datetime"
                                    :readonly=false
                                    v-model="pickerVisible">
                </zm-datetime-picker>
                <zm-radio :editable=false
                          :dict-data="timePoint"
                          v-model="timePointValue"
                          placeholder="请选择时间点"
                          :enable-segment="true"
                          class="item">
                </zm-radio>
            </div>
            <div class="mint-field top-div">
                <zm-radio :editable=false
                          :dict-data="patientCate"
                          v-model="patientCateValue"
                          placeholder="请选择分组"
                          :enable-segment="true"
                          class="item">
                </zm-radio>
                <mt-button type="primary">事务管理</mt-button>
            </div>
            <div class="tips mint-field">
                <span>提示：请记得【保存】录入的内容</span>
            </div>
            <div class="div-tb">
                <table cellpadding="0" cellspacing="0">
                    <thead>
                    <tr>
                        <th>姓名</th>
                        <th>不在</th>
                        <th>体温</th>
                        <th>脉搏</th>
                        <th>呼吸</th>
                        <th>大便</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item,index) in patientBatchSignEntryList" :ref="'tr' + index">
                        <td @click="tdClick(index)">{{item.patientName}}</td>
                        <td>
                            <input type="checkbox" v-if="item.measuretype ===1" checked />
                            <input type="checkbox" v-else />
                        </td>
                        <td>{{item.temper}}</td>
                        <td>{{item.pulse}}</td>
                        <td>{{item.breathe}}</td>
                        <td>{{item.stool}}</td>
                    </tr>
                    </tbody>
                </table>
                <div class="record" ref="record" style="display: none;">
                    <div class="mint-field mrg-bot" style="justify-content:space-between;">
                        <mt-switch v-model="measuretype">不在</mt-switch>
                        <mt-button type="primary" @click.native="viewDetail">预览</mt-button>
                    </div>
                    <div class="mint-field mrg-bot">
                        <zm-field label="体温："
                                  v-model="temper" @focus.native.capture="inputNone('temper', 1)" ref="1"
                                  remark="temper">
                        </zm-field>
                        <label>℃</label>
                        <zm-field label="脉搏："
                                  v-model="pulse" @focus.native.capture="inputNone('pulse', 2)" ref="2" remark="pulse">
                        </zm-field>
                        <label>次/分</label>
                    </div>
                    <div class="mint-field mrg-bot">
                        <zm-field label="呼吸："
                                  v-model="breath" @focus.native.capture="inputNone('breath', 3)" ref="3"
                                  remark="breath">
                        </zm-field>
                        <label>次/分</label>
                        <zm-field label="大便："
                                  v-model="bowels" @focus.native.capture="inputNone('bowels', 4)" ref="4"
                                  remark="bowels">
                        </zm-field>
                        <label>次/天</label>
                    </div>
                    <div class="div-keyboard">
                        <zm-container>
                            <zm-main ref="zmKeyboardMain">
                                <div>
                                    <div class="content">{{entryContent}}</div>
                                    <div class="parent">
                                        <div class="leftChild">
                                            <div>
                                                <mt-button @click.native="onBtnClick(key_37d)">{{key_37d}}</mt-button>
                                                <mt-button @click.native="onBtnClick(key_38d)">{{key_38d}}</mt-button>
                                                <mt-button @click.native="onBtnClick(key_39d)">{{key_39d}}</mt-button>
                                            </div>
                                            <div>
                                                <mt-button @click.native="onBtnClick(key_1)">{{key_1}}</mt-button>
                                                <mt-button @click.native="onBtnClick(key_2)">{{key_2}}</mt-button>
                                                <mt-button @click.native="onBtnClick(key_3)">{{key_3}}</mt-button>
                                            </div>
                                            <div>
                                                <mt-button @click.native="onBtnClick(key_4)">{{key_4}}</mt-button>
                                                <mt-button @click.native="onBtnClick(key_5)">{{key_5}}</mt-button>
                                                <mt-button @click.native="onBtnClick(key_6)">{{key_6}}</mt-button>
                                            </div>
                                            <div>
                                                <mt-button @click.native="onBtnClick(key_7)">{{key_7}}</mt-button>
                                                <mt-button @click.native="onBtnClick(key_8)">{{key_8}}</mt-button>
                                                <mt-button @click.native="onBtnClick(key_9)">{{key_9}}</mt-button>
                                            </div>
                                            <div>
                                                <mt-button @click.native="onBtnClick(key_0)">{{key_0}}</mt-button>
                                                <mt-button @click.native="onBtnClick(key_d)">{{key_d}}</mt-button>
                                            </div>
                                        </div>
                                        <div class="rigthChild">
                                            <mt-button class="btn1" @click.native="onDel"
                                                       @touchstart.native="onLongTouchStartDel"
                                                       @touchend.native="onLongTouchEndDel" ref="delBtn">清空
                                            </mt-button>
                                            <mt-button class="btn2" @click.native="onNextItem">下一项</mt-button>
                                            <mt-button class="btn3" @click.native="onNextPatient">下个病人</mt-button>
                                        </div>
                                    </div>
                                </div>
                            </zm-main>
                        </zm-container>
                    </div>
                </div>
            </div>
        </zm-main>
        <zm-footer class="zm-footer-2"
                   @click.native="handleSaveClick">
            <span class="spn">保&nbsp;&nbsp;&nbsp;存</span>
        </zm-footer>
    </zm-container>

</template>

<style lang="scss">
    .zm-main-2 {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 42px;
        overflow-y: hidden;

    .top-div {
        justify-content: space-around;
        align-items: center;

        .mint-field .mint-cell-title {
            width: 0;
        }

        .mint-field-core{
            text-align: center;
        }
    }

    .item {
        width: 45%;
    }

    .mint-field .mint-cell-title {
        width: 50px;
    }

    .tips {
        height: 30px;
        background-color: orange;
        margin-top: 5px;
        color: #fff;
        align-items: center;
    }

    .div-tb {
        position: absolute;
        width: 100%;
        bottom: 0;
        top: 135px;
        overflow-y: auto;

    .record {
        position: fixed;
        top: 135px;
        left: 80px;
        right: 0;
        background-color: aliceblue;
        bottom: 50px;
        /*display: none;*/
        padding: 5px;
        color: gray;

    .mrg-bot {
        margin-bottom: 10px;
    }

    .mrg-rgh {
        margin-right: 10px;
    }

    .div-keyboard {
        position: absolute;
        bottom: 0;
        width: 100%;

    .parent {
        display: -webkit-flex; /* Safari */
        display: flex;
        flex-direction: row;
    }

    .leftChild {
        flex: 1;
        justify-content: space-around;
    }

    .leftChild div {
        display: flex;
    }

    .leftChild .mint-button {
        flex: 1;
    }

    .rigthChild {
        display: flex;
        flex-direction: column;
    }

    .rigthChild button {
        flex: auto;
    }

    .rigthChild .btn1 {
        align-content: flex-start;
    }

    .rigthChild .btn2 {
        flex: 1;
    }

    .content {
        display: flex;
        height: 30px;
        padding-left: 20px;
        padding-top: 10px;
    }

    }

    }

    table {
        width: 100%;

    thead {
        background-color: aliceblue;
        padding-top: 10px;
        color: #000;

    th {
        height: 40px;
    }

    }

    tbody {

    tr {
        text-align: center;
        height: 40px;
    }

    }
    }
    }
    }

    .zm-footer-2 {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 50px;
        background-color: #00a9fe;

    .spn {
        color: #fff;
        line-height: 50px;
    }

    }
</style>

<script>
    import {Toast, Indicator, Button, DatetimePicker} from 'mint-ui'
    import DictField from '~/components/mixins/dict-field'
    import x2js from 'x2js'

    export default {
        mixins: [DictField],
        data() {
            return {
                patientCate: [],
                patientCateValue: '',
                patientList: [],
                patientBatchSignEntryList: [],
                patientBatchSignEntryXml: '',
                temper: '',
                pulse: '',
                breath: '',
                bowels: '',
                measuretype: false,
                pickerVisible: new Date(),

                entryContent: '',
                key_37d: '37.',
                key_38d: '38.',
                key_39d: '39.',
                key_1: '1',
                key_2: '2',
                key_3: '3',
                key_4: '4',
                key_5: '5',
                key_6: '6',
                key_7: '7',
                key_8: '8',
                key_9: '9',
                key_0: '0',
                key_d: '.',
                Loop: 0,
                focusInput: '',
                timePoint: [],
                timePointValue: '',
                sickList: [],
                focusIndex: 1,
                trIndex: 0,
                sickList: this.$route.query.sickList
            }
        },

        mounted() {
            this.getPatientList();
            this.getPdaTPzemrDict();
            this.patientCate.push({label: '全部', value: 0}, {label: '事物病人', value: 1}, {label: '登记病人', value: 2});
        },

        methods: {
            getPatientList() {
                let vm = this;
                vm.$http.post('mobile/patient/patientInfo/getPatientList', {
                    deptCode: '1010320'
                }).then(res => {
                    if (res.status === 200) {
                        this.patientList = res.data;
                        for (let i = 0; i < this.patientList.length; i++) {
                            this.patientBatchSignEntryList.push({
                                patientName: this.patientList[i].patientName,
                                patientId: this.patientList[i].patientId,
                                eventNo: this.patientList[i].eventNo,
                                measuretype: 0,
                                temper: '',
                                pulse: '',
                                breathe: '',
                                stool: ''
                            });
                        }
                        this.getSignEntryList();
                    }
                }).catch(error => {
                    Toast({
                        message: '获取科室病人列表失败: ' + error,
                        iconClass: 'icon icon-error',
                        duration: 2000
                    })
                })
            },

            //保存
            handleSaveClick() {
                Indicator.open({
                    text: '正在保存...'
                })
                let vm = this;
                let _patientBatchSignEntryXml = vm.loadXMLDoc(this.patientBatchSignEntryXml);
                let root = _patientBatchSignEntryXml.getElementsByTagName("root");
                let node;
                for (let i = 0; i < root[0].childNodes.length; i++) {
                    node = root[0].childNodes[i];
                    for(let j = 0; j < this.patientBatchSignEntryList.length; j++){
                        if(this.patientBatchSignEntryList[j].patientId === node.getAttribute("patientid")){
                            node.setAttribute('measuretype',this.patientBatchSignEntryList[j].measuretype);
                            node.setAttribute('temperature',this.patientBatchSignEntryList[j].temper);
                            node.setAttribute('pluse',this.patientBatchSignEntryList[j].pulse);
                            node.setAttribute('breathe',this.patientBatchSignEntryList[j].breathe);
                            node.setAttribute('stool',this.patientBatchSignEntryList[j].stool);
                            break;
                        }
                    }
                }
                let tendMultiModelStr = {};
                tendMultiModelStr.queryDate = '2019-04-17';
                tendMultiModelStr.batchTpRecord = this.XML2String(_patientBatchSignEntryXml);
                vm.$http.post('mobile/emr/emr/saveTendMultiInfo', {
                    tendMultiModelStr: tendMultiModelStr
                }).then(res => {
                    Toast({
                        message: '保存成功',
                        iconClass: 'mintui mintui-success'
                    })
                }).catch(() => {
                    Toast({
                        message: '保存失败',
                        iconClass: 'mintui mintui-error'
                    })
                }).finally(() => {
                    Indicator.close()
                })
            },

            //解析xml字符串
            loadXMLDoc(xmlString) {
                let xmlDoc = null;
                //判断浏览器的类型
                //支持IE浏览器
                if (!window.DOMParser && window.ActiveXObject) { //window.DOMParser 判断是否是非ie浏览器
                    var xmlDomVersions = ['MSXML.2.DOMDocument.6.0', 'MSXML.2.DOMDocument.3.0', 'Microsoft.XMLDOM'];
                    for (var i = 0; i < xmlDomVersions.length; i++) {
                        try {
                            xmlDoc = new ActiveXObject(xmlDomVersions[i]);
                            xmlDoc.async = false;
                            xmlDoc.loadXML(xmlString); //loadXML方法载入xml字符串
                            break;
                        } catch (e) {
                        }
                    }
                }
                //支持Mozilla浏览器
                else if (window.DOMParser && document.implementation && document.implementation.createDocument) {
                    try {
                        /* DOMParser 对象解析 XML 文本并返回一个 XML Document 对象。
                        * 要使用 DOMParser，使用不带参数的构造函数来实例化它，然后调用其 parseFromString() 方法
                        * parseFromString(text, contentType) 参数text:要解析的 XML 标记 参数contentType文本的内容类型
                        * 可能是 "text/xml" 、"application/xml" 或 "application/xhtml+xml" 中的一个。注意，不支持 "text/html"。
                        */
                        let domParser = new DOMParser();
                        xmlDoc = domParser.parseFromString(xmlString, 'text/xml');
                    } catch (e) {
                    }
                }
                else {
                    return null;
                }
                return xmlDoc;
            },

            //xml对象转字符串
            XML2String(xmlObject) {
                // for IE
                if (window.ActiveXObject) {
                    return xmlObject.xml;
                }
                // for other browsers
                else {
                    return (new XMLSerializer()).serializeToString(xmlObject);
                }
            },

            onBtnClick(obj) {
                this[this.focusInput] = this.entryContent + obj
                this.entryContent = this.entryContent + obj
            },

            onSure() {
                this.popupVisible = false
                this.currentContent = this.entryContent
                this.$emit('input', this.currentContent)// 特定input事件映射于v-model的值
            },

            //清空
            onDel() {
                if (this.entryContent != null && this.entryContent.length > 0) {
                    this.entryContent = "";
                    this[this.focusInput] = "";
                }
            },

            onLongTouchStartDel() {
                let sef = this
                clearInterval(this.Loop)
                this.Loop = setInterval(function () {
                    sef.onDel()
                }, 300)
            },

            onLongTouchEndDel() {
                clearInterval(this.Loop)
            },

            //阻止系统默认软键盘
            inputNone(obj, index) {
                this.focusInput = obj;
                this.focusIndex = index;
                this.entryContent = this[obj];
                document.activeElement.blur();
            },

            //病人点击
            tdClick(index) {
                this.$refs['tr' + this.trIndex][0].firstChild.style.backgroundColor = '#fff';
                this.trIndex = index;
                this.$refs['tr' + index][0].firstChild.style.backgroundColor = '#26a2ff';
                this.$refs.record.style.display = "";
                let rowData = this.patientBatchSignEntryList[index];
                this.measuretype = rowData.measuretype === 1 ? true : false;
                this.temper = rowData.temper;
                this.pulse = rowData.pulse;
                this.breath = rowData.breathe;
                this.bowels = rowData.stool;
            },

            //获取体征字典项数据
            getPdaTPzemrDict() {
                let vm = this;
                vm.$http.post('mobile/emr/emr/getPdaTPzemrDict', {
                    dictName: 'PDA_TPZEMR_CBO'
                }).then(res => {
                    if (res.status === 200) {
                        for (let i = 0; i < res.data.length; i++) {
                            if (res.data[i].babyFlag == "0") {
                                if (res.data[i].nodeName === "TIMEPOINT") {
                                    this.timePoint.push({
                                        label: res.data[i].nameText == "" ? " " : res.data[i].nameText,
                                        value: res.data[i].nameValue
                                    });
                                }
                            }
                        }
                    }
                })
            },

            //获取病人批量体征录入相关信息
            getSignEntryList() {
                let vm = this, tendMultiModelStr = {};
                // tendMultiModelStr.SickList = this.sickList;
                tendMultiModelStr.SickList = this.patientList;
                tendMultiModelStr.queryDate = '2019-04-17'; //this.pickerVisible
                tendMultiModelStr.timePoint = '2';//this.timePointValue;
                tendMultiModelStr.IsFilterTaskSick = false;
                tendMultiModelStr.logonDeptCode = '1010320';
                console.log(tendMultiModelStr);
                vm.$http.post('mobile/emr/emr/getMultiSickSignInfo', {
                    tendMultiModelStr: tendMultiModelStr
                }).then(res => {
                    if (res.status === 200) {
                        this.patientBatchSignEntryXml = res.data;
                        let x2 = new x2js(), x = x2.xml2js(res.data), nodeValue;
                        for (let i = 0; i < x.root.patientinfo.length; i++) {
                            nodeValue = x.root.patientinfo[i];
                            for (let j = 0; j < this.patientBatchSignEntryList.length; j++) {
                                if (x.root.patientinfo[i]._patientid === this.patientBatchSignEntryList[j].patientId) {
                                    this.patientBatchSignEntryList[j].measuretype = nodeValue._measuretype;
                                    this.patientBatchSignEntryList[j].temper = nodeValue._temperature;
                                    this.patientBatchSignEntryList[j].pulse = nodeValue._pluse;
                                    this.patientBatchSignEntryList[j].breathe = nodeValue._breathe;
                                    this.patientBatchSignEntryList[j].stool = nodeValue._stool;
                                    break;
                                }
                            }
                        }
                    }
                }).catch(error => {
                    Toast({
                        message: '获取病人批量体征录入相关信息列表失败: ' + error,
                        iconClass: 'icon icon-error',
                        duration: 2000
                    })
                })
            },

            //下一项
            onNextItem() {
                if (!this.$refs[this.focusIndex + 1]) this.focusIndex = 0;
                this.inputNone(this.$refs[this.focusIndex + 1].$attrs.remark, this.focusIndex + 1);
            },

            //下个病人
            onNextPatient() {
                let rowData = this.patientBatchSignEntryList[this.trIndex];
                rowData.temper = this.temper;
                rowData.pulse = this.pulse;
                rowData.breathe = this.breath;
                rowData.stool = this.bowels;
                this.trIndex += 1;
                this.$refs['tr' + (this.trIndex - 1)][0].firstChild.style.backgroundColor = '#fff';
                this.$refs['tr' + this.trIndex][0].firstChild.style.backgroundColor = '#26a2ff';
                let rowData2 = this.patientBatchSignEntryList[this.trIndex];
                this.temper = rowData2.temper;
                this.pulse = rowData2.pulse;
                this.breath = rowData2.breathe;
                this.bowels = rowData2.stool;
            },

            //预览
            viewDetail() {
                this.$refs.record.style.display = "none";
                let rowData = this.patientBatchSignEntryList[this.trIndex];
                rowData.temper = this.temper;
                rowData.pulse = this.pulse;
                rowData.breathe = this.breath;
                rowData.stool = this.bowels;
            }
        }
    }
</script>