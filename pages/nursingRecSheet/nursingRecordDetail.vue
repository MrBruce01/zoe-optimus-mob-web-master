<template>
    <zm-container class="container">
        <!--<mt-header :title=title>
            <router-link to="./" slot="left">
                <mt-button icon="back">返回</mt-button>
            </router-link>
            <mt-button icon="more" slot="right"></mt-button>
        </mt-header>-->
        <div ref="nursing">
            <div class="mint-field top-div">
                <zm-datetime-picker format="yyyy-MM-dd"
                                    :content.sync="pickerVisible"
                                    type="datetime"
                                    :readonly=false
                                    v-model="pickerVisible"
                                    class="time-pick">
                </zm-datetime-picker>
                <zm-radio placeholder="选择模版"
                          :editable=false
                          :dict-data="tempList"
                          v-model="tempValue"

                          :enable-segment="true">
                </zm-radio>
            </div>
            <div class="mint-field div-second">
                <zm-radio label=""
                          :editable=false
                          :dict-data="timePointList"
                          v-model="timePointValue"
                          :currentContent="timePointValue"
                          :enable-segment="true"
                          style="width: 30%;">
                </zm-radio>
                <mt-button type="default" @click.native="switchInOut" v-show="switchInOut">出入量</mt-button>
                <mt-button type="default" @click.native="addEmptyLine">空白行</mt-button>
            </div>
            <zm-main ref="containerMain" style="position: absolute;top: 120px;left: 0;right: 0;bottom: 50px;">
                <zm-textfield-list :fieldList="fieldList" ref="fieldList"></zm-textfield-list>
                <mt-datetime-picker
                        :value="dateValue"
                        ref="zDtPicker"
                        type="datetime"
                        @confirm="handleChange"
                        @cancel="cancelPick">
                </mt-datetime-picker>
                <mt-field label="" placeholder="请输入" type="textarea" rows="4" v-model="emptyLine" ref="emptyLine"
                          style="display: none;"></mt-field>
            </zm-main>
            <!--<input type="text" @focus="inputFocus()" ref="input">-->
            <zm-footer
                    style="position: absolute;bottom: 0;width: 100%;height: 50px;display: flex;justify-content: space-around;background-color: #fff;">
                <mt-button type="primary" @click.native="delTimePointRecord" ref="delBtn">删&nbsp;&nbsp;&nbsp;除
                </mt-button>
                <mt-button type="primary" @click.native="refer">引&nbsp;&nbsp;&nbsp;用</mt-button>
                <mt-button type="primary" @click.native="addNewTimePointRecord">新&nbsp;&nbsp;&nbsp;增</mt-button>
                <mt-button type="primary" @click.native="handleSaveClick">保&nbsp;&nbsp;&nbsp;存</mt-button>
            </zm-footer>
        </div>
        <div ref="inOut" style="display: none;">
            <mt-header fixed title="出入量维护"></mt-header>
            <zm-main ref="containerMain" style="position: absolute;top: 40px;left: 0;right: 0;bottom: 50px;">
                <mt-navbar v-model="selected">
                    <mt-tab-item id="out">出量(ml)</mt-tab-item>
                    <mt-tab-item id="in">入量(ml)</mt-tab-item>
                </mt-navbar>
                <!-- tab-container -->
                <mt-tab-container v-model="selected">
                    <mt-tab-container-item id="in">
                        <zm-field v-for="(item, index) in inList" :label="item.__text + ':'" :key="index"
                                  v-model="item.value">
                        </zm-field>
                    </mt-tab-container-item>
                    <mt-tab-container-item id="out">
                        <zm-field v-for="(item, index) in outList" :label="item.__text + ':'" :key="index"
                                  v-model="item.value">
                        </zm-field>
                    </mt-tab-container-item>
                </mt-tab-container>
            </zm-main>
            <zm-footer
                    style="position: absolute;bottom: 0;width: 100%;height: 50px;display: flex;justify-content: space-around;background-color: #fff;">
                <mt-button type="primary" @click.native="cancel">取&nbsp;&nbsp;&nbsp;消</mt-button>
                <mt-button type="primary" @click.native="saveInOut">保&nbsp;&nbsp;&nbsp;存</mt-button>
            </zm-footer>
        </div>
        <div ref="refer" style="display: none;width: 100%;">
            <zm-datetime-picker format="yyyy-MM-dd"
                                :content.sync="pickerVisible2"
                                type="datetime"
                                :readonly=false
                                v-model="pickerVisible2"
                                class="time-pick">
            </zm-datetime-picker>
            <div class="mint-field div-second div-pad">
                <span>术后天数 --</span>
                <mt-switch v-model="refuseOrNotIn">不在/拒测</mt-switch>
            </div>
            <div class="div-ref">
                <table cellpadding="0" cellspacing="0">
                    <thead>
                    <tr>
                        <th>时间</th>
                        <th>体温</th>
                        <th>脉搏</th>
                        <th>呼吸</th>
                        <th>血压</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="item in tpList" key="000">
                        <td>{{item.timepoint}}</td>
                        <td>{{item.temperature}}</td>
                        <td>{{item.pluse}}</td>
                        <td>{{item.breathe}}</td>
                        <td>{{item.bloodpressure1}}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <zm-footer
                    style="position: absolute;bottom: 0;width: 100%;height: 50px;background-color: #fff;">
                <mt-button type="primary" @click.native="referIn" style="width: 100%;">引&nbsp;&nbsp;&nbsp;用</mt-button>
            </zm-footer>
        </div>
    </zm-container>
</template>

<style lang="scss">
    .container {

    .top-div {

    .mint-field .mint-cell-title {
        width: 20px;
    }

    }

    .div-second {
        justify-content: space-around;
        align-items: center;

    .mint-field .mint-cell-title {
        width: 0;
    }

    }

    .mint-field .mint-cell-title {
        width: 90px;
        text-align: right;
        margin-right: 10px;
    }

    .spn {
        color: #fff;
        line-height: 50px;
    }

    .dsp-none {
        display: none;
    }

    .div-pad {
        padding: 10px;
    }

    .div-ref {

    table {
        width: 100%;
        text-align: center;

    thead {
        background-color: aliceblue;
        padding-top: 10px;
        color: #000;

    th {
        height: 40px;
    }

    }

    }
    }

    }
</style>

<!--<script type='text/javascript' src="~/utils/xml2json.js"></script>-->

<!--<script src="https://cdn.bootcss.com/jquery/3.2.1/jquery.js"></script>
<script type="text/javascript" src="http://www.jsons.cn/Down/jquery.xml2json.js"></script>-->
<script>
    import {Header, Toast, Indicator, Button, Navbar, TabItem} from 'mint-ui'
    import _ from 'lodash'
    import MtCell from '../../node_modules/mint-ui/packages/cell/src/cell.vue'

    import x2js from 'x2js'
    import {mapGetters} from 'vuex'

    export default {
        components: {MtCell},
        layout: 'record',
        head() {
            return {
                title: this.title
            }
        },
        data() {
            return {
                title: this.$route.query.title,
                deptCode: this.$route.query.deptCode,
                tempId: this.$route.query.tempId,
                pickerVisible: new Date(),
                tempList: [],
                tempValue: '',
                timePointList: [],
                timePointValue: '',
                validNodeList: [],
                ignoreNodeList: [],
                selected: 'in',
                inList: [],
                outList: [],
                inListXml: '',
                outListXml: '',
                formContent: [],
                formContentXml: [],
                dateValue: new Date(),
                emptyLine: '',
                xmlDOM: '',
                isEmptyLine: false,

                formData: [],
                formId: '',
                readState: false, // 只读控制
                taskId: '',
                isNew: 1,
                // xmlContent: this.$route.query.xmlContent,
                // tempList: this.$store.state.tempList,
                xmlContent: '',
                nodeModelOneList: [],
                nodeModelTwoList: [],
                fieldList: [],
                tempContent: [],
                patientId: this.$route.query.patientId,
                eventNo: this.$route.query.eventNo,
                week: this.$route.query.week,
                serial: this.$route.query.serial,
                isNewAddOrEmptyLine: 0,
                refuseOrNotIn: false,
                pickerVisible2: new Date(),
                tpList: [],
                switchInOut: true
            }
        },

        computed: {
            ...mapGetters(['getTempList'])
        },

        mounted() {
            this.getFormList();
            this.getBaseDict();
            this.getFormContent();
        },

        methods: {
            //获取护理记录模版
            getFormList() {
                var vm = this;
                this.$http.post('mobile/emr/emr/getDeptNurseTempList', {
                    deptId: vm.deptCode
                }).then(res => {
                    if (res.status === 200) {
                        let x2 = new x2js(), x = x2.xml2js(res.data);
                        for (let i = 0; i < x.root.temp.length; i++) {
                            this.tempList.push({label: x.root.temp[i].__text, value: x.root.temp[i]._id});
                        }
                    }
                }).catch(error => {
                    Toast({
                        message: '获取科室护理记录模版列表失败: ' + error,
                        iconClass: 'icon icon-error',
                        duration: 2000
                    })
                })
            },

            //获取护理记录模版内容
            getTemplateContent(val) {
                var vm = this;
                vm.fieldList = [];
                return this.$http.post('mobile/emr/emr/getEmrNurseTemplateContent', {
                    deptId: this.deptCode,
                    templateId: this.tempId
                }).then(res => {
                    if (res.status === 200) {
                        let x2 = new x2js(), x = x2.xml2js(res.data), textFieldType, editState = 0, title, editPrompt,
                            content = "", value, _dirty_ = false, type, formatString, code, items = [],
                            xmlResult = vm.loadXMLDoc(res.data);
                        for (let item in x.root) {
                            for (let i = 0; i < this.validNodeList.length; i++) {
                                if (this.validNodeList[i].VALUE_CODE === item) {
                                    title = this.validNodeList[i].VALUE_NAME;
                                    break;
                                }
                            }
                            if (typeof title === "undefined") continue;
                            if (x.root[item] === "") {
                                textFieldType = 1;
                                editPrompt = "";
                                items = [];
                            } else if (x.root[item]._select) {
                                textFieldType = 3;
                                let arr = x.root[item]._select.split('/');
                                for (let i = 0; i < arr.length; i++) {
                                    items.push({label: arr[i], value: arr[i]});
                                }
                                editPrompt = "";
                            } else if (x.root[item]._validate) {
                                editPrompt = x.root[item]._validate;
                                items = [];
                            } else {
                                if (item === "input_item_xml") {
                                    this.inList = x.root[item].item;
                                    this.inListXml = xmlResult.getElementsByTagName(item)[0];
                                } else if (item === "output_item_xml") {
                                    this.outList = x.root[item].item;
                                    this.outListXml = xmlResult.getElementsByTagName(item)[0];
                                }
                                continue;
                            }
                            ;
                            code = item;
                            vm.fieldList.push({
                                textFieldType: textFieldType,
                                editState: editState,
                                title: title,
                                editPrompt: editPrompt,
                                content: content,
                                _dirty_: _dirty_,
                                value: value,
                                items: items,
                                type: type,
                                code: code,
                                formatString: formatString
                            });
                        }
                        return x;
                    }
                }).catch(error => {
                    Toast({
                        message: '获取科室护理记录模版列表失败: ' + error,
                        iconClass: 'icon icon-error',
                        duration: 2000
                    })
                })
            },

            //获取基本字典
            getBaseDictType(dictName) {
                var vm = this;
                return this.$http.post('mobile/base/baseDict/getBaseDict', {
                    dictName: dictName
                }).then(res => {
                    if (res.status === 200) {
                        return res.data;
                    }
                }).catch(error => {
                    Toast({
                        message: '获取获取基本字典列表失败: ' + error,
                        iconClass: 'icon icon-error',
                        duration: 2000
                    })
                })
            },

            //获取基本字典
            getBaseDict() {
                let vm = this;
                this.$http.all([this.getBaseDictType('PDA_STRUCTTEND_VALID_NODE'), this.getBaseDictType('PDA_STRUCTTEND_IGNORE_NODE')]).then(this.$http.spread(function (list1, list2) {
                    for (let i = 0; i < list1.baseDictList.length; i++) {
                        for (let j = 0; j < list2.baseDictList.length; j++) {
                            if (list1.baseDictList[i].VALUE_CODE === list2.baseDictList[j].VALUE_CODE) {
                                list1.baseDictList.splice(i, 1);
                                list2.baseDictList.splice(j, 1);
                                break;
                            }
                        }
                    }
                    vm.validNodeList = list1.baseDictList;
                    vm.ignoreNodeList = list2.baseDictList;
                    vm.getTemplateContent();
                }))
            },

            //出入量切换
            switchInOut() {
                this.$refs.nursing.style.display = "none";
                this.$refs.inOut.style.display = "";
            },

            //取消
            cancel() {
                this.$refs.nursing.style.display = "";
                this.$refs.inOut.style.display = "none";
            },

            //保存
            saveInOut() {
                this.$refs.nursing.style.display = "";
                this.$refs.inOut.style.display = "none";
            },

            //获取表单内容
            getFormContent() {
                var vm = this, strEmrQueryModel = {};
                vm.timePointList = [];
                vm.timePointValue = "";
                strEmrQueryModel.sickId = '3001927434';
                strEmrQueryModel.resdinceNo = '401957002';
                strEmrQueryModel.beginDate = '2019-04-25';
                strEmrQueryModel.endDate = '2019-04-25';
                return this.$http.post('mobile/emr/emr/getEmrNurseRecord', {
                    strEmrQueryModel: strEmrQueryModel
                }).then(res => {
                    if (res.status === 200) {
                        let x2 = new x2js(), x = x2.xml2js(res.data)
                        this.formContent = x;
                        this.formContentXml = res.data;
                        for (let i = 0; i < x.root.row.length; i++) {
                            let time = x.root.row[i].time;
                            time = time.substr(11, time.length - 1);
                            vm.timePointList.push({label: time, value: time});
                        }
                        let date = new Date(),
                            currentHours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours(),
                            currentMinutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes(),
                            currentTime = currentHours + ':' + currentMinutes;
                        this.timePointList.push({label: currentTime, value: currentTime});
                    }
                }).catch(error => {
                    Toast({
                        message: '获取获取基本字典列表失败: ' + error,
                        iconClass: 'icon icon-error',
                        duration: 2000
                    })
                })
            },

            //设置表单内容
            setFormContent(val) {
                let formContentRow = this.formContent.root.row;
                for (let i = 0; i < formContentRow.length; i++) {
                    if (formContentRow[i].time.indexOf(val) > -1) {
                        for (let item in formContentRow[i]) {
                            for (let j = 0; j < this.fieldList.length; j++) {
                                if (this.fieldList[j]["code"] === item) {
                                    this.fieldList[j]["value"] = this.fieldList[j]["content"] = formContentRow[i][item];
                                    break;
                                }
                            }
                        }
                        break;
                    } else if (i === formContentRow.length - 1) {
                        for (let j = 0; j < this.fieldList.length; j++) {
                            this.fieldList[j]["value"] = this.fieldList[j]["content"] = "";
                        }
                    }
                }
            },

            //新增新的时间点护理记录
            addNewTimePointRecord() {
                this.isNewAddOrEmptyLine = 1;
                this.$refs.zDtPicker.open();
            },

            //新增（空白行）时间点确定
            handleChange(val) {
                let curHours = new Date(val).getHours() < 10 ? '0' + new Date(val).getHours() : new Date(val).getHours(),
                    curMinutes = new Date(val).getMinutes() < 10 ? '0' + new Date(val).getMinutes() : new Date(val).getMinutes(),
                    curDateTime = curHours + ':' + curMinutes;
                this.timePointList.splice(-1, 1);
                this.timePointList.push({label: curDateTime, value: curDateTime});
                this.timePointValue = curDateTime;
                this.$refs.delBtn.$el.style.display = 'none';
                if (this.isNewAddOrEmptyLine === 1) this.fieldList = [];
                else if (this.isNewAddOrEmptyLine === 0) {
                    this.switchInOut = false;
                    this.$refs.emptyLine.$el.style.display = "";
                    this.$refs.fieldList.$el.style.display = "none";
                }
            },

            //新增空白行
            addEmptyLine() {
                this.isEmptyLine = true;
                this.isNewAddOrEmptyLine = 0;
                this.$refs.zDtPicker.open();
            },

            //保存
            handleSaveClick() {
                let vm = this;
                Indicator.open({
                    text: '正在保存...'
                })
                if (this.isEmptyLine) {
                    this.saveEmptyLine();
                } else {
                    let xmlFormContent = this.loadXMLDoc(this.formContentXml), delRow;
                    for (let i = 0; i < xmlFormContent.getElementsByTagName("row").length; i++) {
                        if (xmlFormContent.getElementsByTagName("row")[i].getElementsByTagName("time")[0].innerHTML.indexOf(this.timePointValue) === -1) {
                            delRow = xmlFormContent.getElementsByTagName("row")[i];
                            xmlFormContent.documentElement.removeChild(delRow);
                        }
                    }
                    for (let i = 0, len = vm.inList.length; i < len; i++) {
                        for (let j = 0, len2 = vm.inListXml.childNodes.length; j < len2; j++) {
                            if (vm.inList[i]._dictitemid === vm.inListXml.childNodes[j].getAttribute('dictitemid')) {
                                vm.inListXml.childNodes[j].setAttribute('value', vm.inList[i].value);
                                break;
                            }
                        }
                    }
                    for (let i = 0, len = vm.outList.length; i < len; i++) {
                        for (let j = 0, len2 = vm.outListXml.childNodes.length; j < len2; j++) {
                            if (vm.outList[i]._dictitemid === vm.outListXml.childNodes[j].getAttribute('dictitemid')) {
                                vm.outListXml.childNodes[j].setAttribute('value', vm.outList[i].value);
                                break;
                            }
                        }
                    }
                    let root = xmlFormContent.getElementsByTagName("root");
                    for (let i = 0; i < root[0].childNodes[0].childNodes.length; i++) {
                        let node = root[0].childNodes[0].childNodes;
                        if (node[i].nodeName === "input_xml_data") {
                            node[i].textContent = this.XML2String(vm.inListXml);
                        } else if (node[i].nodeName === "output_xml_data") {
                            node[i].textContent = this.XML2String(vm.outListXml);
                        } else {
                            for (let k = 0; k < this.fieldList.length; k++) {
                                if (this.fieldList[k].code === node[i].nodeName) {
                                    node[i].textContent = this.fieldList[k].content;
                                    continue;
                                }
                            }
                        }
                    }
                    this.xmlDOM = this.createXMLDOM();
                    let lastNode = xmlFormContent.getElementsByTagName("row")[0];
                    vm.addExtraNode.call(xmlFormContent, lastNode, "age", "59岁");
                    vm.addExtraNode.call(xmlFormContent, lastNode, "bed", "16+1");
                    vm.addExtraNode.call(xmlFormContent, lastNode, "dept", "心血管内科病房");
                    vm.addExtraNode.call(xmlFormContent, lastNode, "intime", "2011-03-01");
                    vm.addExtraNode.call(xmlFormContent, lastNode, "name", "苏吉忠");
                    vm.addExtraNode.call(xmlFormContent, lastNode, "sex", "男");
                    vm.addExtraNode.call(xmlFormContent, lastNode, "patient_id", "3002005882");
                    vm.addExtraNode.call(xmlFormContent, lastNode, "event_no", "408200001");
                    vm.addExtraNode.call(xmlFormContent, lastNode, "dept_id", "1010320");
                    vm.addExtraNode.call(xmlFormContent, lastNode, "dept_name", "心血管内科病房");
                    vm.addExtraNode.call(xmlFormContent, lastNode, "ip", "192.168.3.2");
                    vm.addExtraNode.call(xmlFormContent, lastNode, "cp_name", "jzh-pc");
                    vm.addExtraNode.call(xmlFormContent, lastNode, "sys_name", "pda系统");
                    debugger
                    //获取要保存数据
                    this.$http.post('mobile/emr/emr/saveEmrNurseRecord', {
                        sickId: "3001927434",
                        visitNumber: "2",
                        logonDeptCode: "1010320",
                        operatorMan: "",
                        timePointRecord: this.XML2String(xmlFormContent)
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
                }
            },

            //JS创建xml对象
            createXMLDOM() {
                var xmlDOM;
                if (window.ActiveXObject) {
                    xmlDOM = new ActiveXObject('Microsoft.XMLDOM');
                } else if (document.implementation
                    && document.implementation.createDocument) {
                    xmlDOM = document.implementation.createDocument('', '', null);
                } else {
                    Toast({
                        message: '您的浏览器不支持文档对象XMLDOM',
                        iconClass: 'mintui mintui-error'
                    })
                    return;
                }
                return xmlDOM;
            },

            //添加XML子节点
            addCDATAChild(parentNode, node, text) {
                let newEle = this.xmlDOM.createElement(node),
                    newText = this.xmlDOM.createTextNode('<![CDATA["' + text + '"]]');
                let newNode = newEle.appendChild(newText);
                parentNode.appendChild(newEle);
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
                    return new XMLSerializer().serializeToString(xmlObject);
                }
            },

            //保存空白行
            saveEmptyLine() {
                this.xmlDOM = this.createXMLDOM();
                let root;
                if (this.xmlDOM) {
                    root = this.xmlDOM.createElement('root');
                    let row = this.xmlDOM.createElement('row');
                    root.appendChild(row);
                    this.addCDATAChild(row, 'empty_row', this.emptyLine);
                    this.addCDATAChild(row, 'input_quantity', "");
                    this.addCDATAChild(row, 'utput_quantity', "");
                    this.addCDATAChild(row, 'id', "");
                    this.addCDATAChild(row, 'catalog_id', "");
                    this.addCDATAChild(row, 'emr_type', "");

                    this.addCDATAChild(row, 'type', "");
                    this.addCDATAChild(row, 'creator_id', "");
                    this.addCDATAChild(row, 'creator_name', "");
                    this.addCDATAChild(row, 'create_time', "");
                    this.addCDATAChild(row, 'creator_dept_id', "");
                    this.addCDATAChild(row, 'modifier_id_list', "");
                    this.addCDATAChild(row, 'modifier_name_list', "");
                    this.addCDATAChild(row, 'modify_time_list', "");
                    this.addCDATAChild(row, 'bed', "");
                    this.addCDATAChild(row, 'dept_name', "");
                    this.addCDATAChild(row, 'intime', "");
                    this.addCDATAChild(row, 'name', "");
                    this.addCDATAChild(row, 'sex', "");
                    this.addCDATAChild(row, 'patient_id', "");
                    this.addCDATAChild(row, 'event_no', "");
                    this.addCDATAChild(row, 'dept_id', "");
                    this.addCDATAChild(row, 'ip', "");
                    this.addCDATAChild(row, 'cp_name', "");
                    this.addCDATAChild(row, 'sys_name', "");
                    this.addCDATAChild(row, 'time', "");
                }
                let xmlContentHeader = "<?xml version='1.0'?>";
                this.$http.post('mobile/emr/emr/saveEmrNurseRecord', {
                    sickId: "3001927434",
                    visitNumber: "2",
                    logonDeptCode: "1010320",
                    operatorMan: "",
                    timePointRecord: xmlContentHeader + this.XML2String(root)
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
                this.isEmptyLine = false;
            },

            //时间点取消
            cancelPick() {
            },

            //删除护理记录
            delTimePointRecord() {
                this.$http.post('mobile/emr/emr/deleteEmrNurseRecord', {
                    sickId: "3001927434", visitNumber: "2", resdinceNo: "1010320", timeValue: this.timePointValue
                }).then(res => {
                    Toast({
                        message: '删除成功',
                        iconClass: 'mintui mintui-success'
                    })
                }).catch(() => {
                    Toast({
                        message: '删除失败',
                        iconClass: 'mintui mintui-error'
                    })
                }).finally(() => {
                    Indicator.close()
                })
            },

            //新增节点
            addExtraNode(xmlDoc, nodeName, nodeValue) {
                let newNode = this.xmlDOM.createElement(nodeName),
                    newText = this.xmlDOM.createTextNode('<![CDATA["' + nodeValue + '"]]');
                newNode.appendChild(newText);
                xmlDoc.appendChild(newNode);
            },

            //引用
            refer() {
                // this.$refs.refer.$el.toggle();
                this.$refs.refer.style.display = "";
                this.$refs.nursing.style.display = "none";
                this.$refs.emptyLine.$el.style.display = "none";
                this.$refs.fieldList.$el.style.display = "none";
                this.getTpRecordList();
            },

            //获取病人体征列表
            getTpRecordList() {
                this.$http.post('mobile/emr/emr/searchTpRecord', {
                    date: "2019-04-28", eventNo: "413951001", serialNo: "0"
                }).then(res => {
                    this.tpList = res.data;
                }).catch(() => {
                    Toast({
                        message: '获取体征列表失败',
                        iconClass: 'mintui mintui-error'
                    })
                }).finally(() => {
                    Indicator.close()
                })
            },

            //引用确定
            referIn(){
                this.$refs.refer.style.display = "none";
                this.$refs.nursing.style.display = "";
                if (this.isNewAddOrEmptyLine === 0) {
                    this.$refs.emptyLine.$el.style.display = "";
                    this.$refs.fieldList.$el.style.display = "none";
                }else{
                    this.$refs.emptyLine.$el.style.display = "none";
                    this.$refs.fieldList.$el.style.display = "";
                }
            }
        },

        watch: {
            tempValue(val) {
                this.getTemplateContent(val);
                this.getFormContent();
            },

            timePointValue(val) {
                this.setFormContent(val);
            }
        }
    }
</script>