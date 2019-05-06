<template>    
    <zm-container>
        <div class="container" ref="zm-container-1">
            <!--<mt-header :title=title>
                <router-link to="./" slot="left">
                    <mt-button icon="back">返回</mt-button>
                </router-link>
                <mt-button icon="more" slot="right"></mt-button>
            </mt-header>-->
            <div>
                <zm-datetime-picker :format="dateFormatString"
                                    :content.sync="date"
                                    type="date"
                                    label="登记日期"
                                    :readonly=true
                                    v-model="date">
                </zm-datetime-picker>
                <div class="div-tool">
                    <mt-button type="primary">事务病人</mt-button>
                </div>
                <div class="mint-field div-filter">
                    <zm-radio label=""
                              placeholder="测量类型"
                              :editable=false
                              :dict-data="measureTypeData"
                              v-model="measuretype"
                              :readonly=true
                              :enable-segment="true">
                    </zm-radio>
                    <!--:content.sync="measuretype"-->
                    <zm-radio label=""
                              placeholder="测量时间点"
                              :editable=false
                              :dict-data="timePointData"
                              v-model="timePointValue"
                              :readonly=true
                              :enable-segment="true">
                    </zm-radio>
                </div>
            </div>
            <zm-main ref="containerMain" class="zm-main-2">
                <div class="mint-field">
                    <zm-keyboard label="体温(℃)：" v-model="temperature" class="item" width="90"
                                 :value="temperature"></zm-keyboard>
                    <zm-radio label="测量部位："
                              placeholder=""
                              :editable=false
                              :dict-data="dictData"
                              v-model="temptype"
                              :enable-segment="true">
                    </zm-radio>
                    <!--:content.sync="temptype"-->
                </div>
                <mt-cell title="脉搏：" class="mint-field">
                    <input type="text"
                           style="margin-right: 14px;"
                           v-model="pluse"
                           class="mint-field-core"/>
                    <label class="pad-rgh">(次/分)</label>
                    <mt-switch v-model="pluseflag">脉搏短绌</mt-switch>
                </mt-cell>
                <mt-cell title="呼吸：" class="mint-field">
                    <input type="text"
                           style="margin-right: 14px;"
                           v-model="breathe"
                           class="mint-field-core"/>
                    <label class="pad-rgh">(次/分)</label>
                    <mt-switch v-model="breatheflag">呼&nbsp;&nbsp;吸&nbsp;&nbsp;机</mt-switch>
                </mt-cell>
                <mt-cell title="心率：" class="mint-field">
                    <input type="text"
                           style="margin-right: 14px;"
                           v-model="heartrate"
                           class="mint-field-core"/>
                    <label class="pad-rgh">(次/分)</label>
                    <mt-switch v-model="tempsameflag">体温不升</mt-switch>
                </mt-cell>
                <div class="mint-field">
                    <zm-field label="物理降温："
                              v-model="physicaldown"></zm-field>
                    <zm-field label="复试体温："
                              v-model="secondtemp">
                    </zm-field>
                </div>
                <div class="mint-field">
                    <zm-radio label="大便次数："
                              :editable=false
                              :dict-data="stoolData"
                              v-model="stool"
                              :enable-segment="true"
                              style="width: 60%;">
                    </zm-radio>
                    <!--:content.sync="stool"-->
                    <!--<mt-switch v-model="value4" style="align-self: flex-end;">下午测量</mt-switch>-->
                </div>
                <mt-cell title="小便：" class="mint-field">
                    <input type="text"
                           style="margin-right: 14px;"
                           v-model="urine"
                           class="mint-field-core"/>
                    <label class="pad-rgh">(ml)</label>
                    <!--<mt-switch v-model="value5">下午测量</mt-switch>-->
                </mt-cell>
                <!--<mt-cell title="疼痛强度" is-link v-model="painstrength"></mt-cell>-->
                <zm-radio label="疼痛强度："
                          :editable=false
                          :dict-data="painList"
                          v-model="painstrength"
                          :enable-segment="true">
                    <!--:content.sync="painstrength"-->
                </zm-radio>
                <mt-cell title="血压1：" class="mint-field">
                    <input type="text"
                           style="margin-right: 14px;"
                           v-model="bloodpressure1high"
                           class="mint-field-core"/>
                    <label>/</label>
                    <input type="text"
                           style="margin-right: 14px;"
                           v-model="bloodpressure1lower"
                           class="mint-field-core"/>
                    <label class="pad-rgh">(mmHa)</label>
                    <mt-switch v-model="bloodpressure1NotIn">不在</mt-switch>
                </mt-cell>
                <mt-cell title="血压2：" class="mint-field">
                    <input type="text"
                           style="margin-right: 14px;"
                           v-model="bloodpressure2high"
                           class="mint-field-core"/>
                    <label>/</label>
                    <input type="text"
                           style="margin-right: 14px;"
                           v-model="bloodpressure2lower"
                           class="mint-field-core"/>
                    <label class="pad-rgh">(mmHa)</label>
                    <mt-switch v-model="bloodpressure2NotIn">不在</mt-switch>
                </mt-cell>
                <mt-cell title="血压3：" class="mint-field">
                    <input type="text"
                           style="margin-right: 14px;"
                           v-model="bloodpressure3high"
                           class="mint-field-core"/>
                    <label>/</label>
                    <input type="text"
                           style="margin-right: 14px;"
                           v-model="bloodpressure3lower"
                           class="mint-field-core"/>
                    <label class="pad-rgh">(mmHa)</label>
                    <mt-switch v-model="bloodpressure3NotIn">不在</mt-switch>
                </mt-cell>
                <div class="mint-field">
                    <mt-field label="其它排出物：" placeholder="" v-model="otherout"></mt-field>
                    <mt-field label="小便次数：" placeholder="" v-model="urine_count"></mt-field>
                </div>
                <zm-radio label="出量标题："
                          :editable=false
                          :dict-data="outPutTitleList"
                          v-model="outputtitle"
                          :enable-segment="true">
                </zm-radio>
                <!--:content.sync="outputtitle"-->
                <div class="mint-field">
                    <mt-field label="总入量(ml)" placeholder="" v-model="totalin"></mt-field>
                    <mt-field label="出量(ml)" placeholder="" v-model="totalout"></mt-field>
                </div>
                <div title="" class="mint-field">
                    <mt-field label="升高(cm)" placeholder="" v-model="height"></mt-field>
                    <mt-field label="体重(kg)" placeholder="" v-model="weight"></mt-field>
                </div>
                <div class="mint-field">
                    <zm-radio label="入院方式"
                              :editable=false
                              :dict-data="inHospitalTypeList"
                              v-model="inHospitalType"
                              :enable-segment="true">
                    </zm-radio>
                    <!--:content.sync="inHospitalType"-->
                    <zm-radio label="术后日数"
                              :editable=false
                              :dict-data="operationDayList"
                              v-model="operationday"
                              :enable-segment="true">
                    </zm-radio>
                    <!--:content.sync="operationday"-->
                </div>
                <mt-cell title="6PM">
                    <label class="lb-tp">后病人突然发热，体温</label>
                    <input type="text" v-model="raisetemp" class="mint-field-core"/>
                    <label>(℃)</label>
                </mt-cell>
                <div><label>上注释</label></div>
                <mt-cell is-link @click.native="toptipMethod">
                    <!--<zm-radio label=""
                              placeholder=""
                              :editable=false
                              :dict-data="annotation"
                              v-model="toptipbtn"
                              :enable-segment="true">
                    </zm-radio>-->
                    <span v-model="toptip" ref="toptip"></span>
                </mt-cell>
                <div><label>药物过敏</label></div>
                <mt-cell is-link v-for="(item,index) in drugAllergyList" :key="index + 'a'"
                         @click.native="allergyMethod(item)">
                    <!--<zm-radio :editable=false
                              :dict-data="drugAllergy"
                              v-model="drugAllergyValue"
                              :enable-segment="true">
                    </zm-radio>-->
                    <span :v-model="'allergy' + item" :ref="'allergy' + item"></span>
                </mt-cell>
                <div><label>补充说明</label></div>
                <mt-cell is-link v-for="(item,index) in remarkList" :key="index"
                         @click.native="othertitle1Method(item)">
                    <!--<zm-radio :editable=false
                              :dict-data="remark"
                              v-model="remarkValue"
                              :enable-segment="true">
                    </zm-radio>-->
                    <span :v-model="'othertitle'+ item" :ref="'othertitle' + item"></span>
                </mt-cell>
                <zm-datetime-picker :format="formatString"
                                    :content.sync="intime"
                                    type="datetime"
                                    label="入院时间"
                                    :readonly=true
                                    v-model="intime">
                </zm-datetime-picker>
            </zm-main>
            <zm-footer class="zm-footer-2" @click.native="handleSaveClick">
                <span class="spn">保&nbsp;&nbsp;&nbsp;存</span>
            </zm-footer>
        </div>
        <div class="container2" ref="zm-container-2" style="display: none;">
            <zm-main>
                <mt-field label="" placeholder="请填写入院时间" type="textarea" rows="4" v-model="toptipValue"
                          ref="toptipField"></mt-field>
                <zm-radio placeholder="请填写类别"
                          :editable=false
                          :dict-data="toptipList"
                          v-model="toptipValue2"
                          :enable-segment="true">
                </zm-radio>
            </zm-main>
            <zm-footer class="zm-footer-3 mint-field">
                <mt-button type="primary" @click.native="cancel">取&nbsp;&nbsp;&nbsp;消</mt-button>
                <mt-button type="primary" @click.native="determine">确&nbsp;&nbsp;&nbsp;定</mt-button>
            </zm-footer>
        </div>
        <div class="container2" ref="zm-container-3" style="display: none;">
            <zm-main>
                <zm-radio placeholder="请填写药品名称"
                          :editable=false
                          :dict-data="allergyList"
                          v-model="allergyValue"
                          :enable-segment="true">
                </zm-radio>
                <zm-radio placeholder="请填写结果"
                          :editable=false
                          :dict-data="resultList"
                          v-model="resultValue"
                          :enable-segment="true">
                </zm-radio>
            </zm-main>
            <zm-footer class="zm-footer-3 mint-field">
                <mt-button type="primary" @click.native="cancel2">取&nbsp;&nbsp;&nbsp;消</mt-button>
                <mt-button type="primary" @click.native="determine2">确&nbsp;&nbsp;&nbsp;定</mt-button>
            </zm-footer>
        </div>
        <div class="container2" ref="zm-container-4" style="display: none;">
            <zm-main>
                <zm-radio placeholder="请填写描述内容"
                          :editable=false
                          :dict-data="othertitleList"
                          v-model="othertitleValue"
                          :enable-segment="true">
                </zm-radio>
                <zm-radio placeholder="请填写备注"
                          :editable=false
                          :dict-data="othertitleRemarkList"
                          v-model="othertitleRemarkValue"
                          :enable-segment="true">
                </zm-radio>
                <zm-radio placeholder="请填写结果"
                          :editable=false
                          :dict-data="othertitleResultList"
                          v-model="othertitleResultValue"
                          :enable-segment="true">
                </zm-radio>
            </zm-main>
            <zm-footer class="zm-footer-3 mint-field">
                <mt-button type="primary" @click.native="cancel3">取&nbsp;&nbsp;&nbsp;消</mt-button>
                <mt-button type="primary" @click.native="determine3">确&nbsp;&nbsp;&nbsp;定</mt-button>
            </zm-footer>
        </div>
    </zm-container>
</template>

<style lang="scss">
    .container {

    .div-tool {
        width: 90%;
        margin: 5px auto;

    button {
        width: 100%;
    }

    }

    .div-filter {

    .mint-field .mint-cell-title {
        width: 0;
    }

    }
    .zm-main-2 {
        position: absolute;
        top: 150px;
        left: 0;
        right: 0;
        bottom: 42px;

    .mint-field .mint-cell-title {
        width: 90px;
    }

    .pad-rgh {
        padding-right: 10px;
    }

    .lb-tp {
        margin: 0 10px;
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
    }

    .container2 {
        width: 100%;

    .zm-footer-3 {
        position: absolute;
        bottom: 0;
        height: 50px;
        width: 100%;
        background-color: #fff;
        justify-content: space-around;
    }

    }
</style>

<script>
    import {Toast, Indicator, Button, Popup, Radio, Switch, DatetimePicker} from 'mint-ui'
    import ZmKeyboard from '~/components/common/keyboard/src/main'
    import x2js from 'x2js'
    import JsHelper from '~/utils/JsHelper'

    export default {
        components: {ZmKeyboard},
        data() {
            return {
                title: '体征录入',
                dictData: [],
                outPutTitleList: [],
                inHospitalTypeList: [],
                operationDayList: [],
                stoolData: [],
                temptype: '',
                temperature: 36,
                pluse: '',
                pluseflag: false,
                breathe: '',
                breatheflag: false,
                heartrate: '',
                tempsameflag: false,
                secondtemp: '',
                physicaldown: '',
                stool: '',
                urine: '',
                painstrength: 1,
                bloodpressure1: '',
                bloodpressure1high: '',
                bloodpressure1lower: '',
                bloodpressure1NotIn: false,
                bloodpressure2: '',
                bloodpressure2high: '',
                bloodpressure2lower: '',
                bloodpressure2NotIn: false,
                bloodpressure3: '',
                bloodpressure3high: '',
                bloodpressure3lower: '',
                bloodpressure3NotIn: false,
                otherout: '',
                urine_count: '',
                outputtitle: '',
                totalin: '',
                totalout: '',
                height: '',
                weight: '',
                inHospitalType: '',
                operationday: '',
                raisetemp: '',
                toptipbtn: '',
                allergybtn: '',
                allergy2btn: '',
                allergy3btn: '',
                othertitle1btn: '',
                othertitle2btn: '',
                othertitle3btn: '',
                othertitle4btn: '',
                othertitle5btn: '',
                intime: new Date(),
                toptipValue: '',
                toptipValue2: '',
                toptipList: [],
                allergyList: [],
                allergyValue: '',
                resultList: [],
                resultValue: '',
                othertitleList: [],
                othertitleValue: '',
                othertitleRemarkList: [],
                othertitleRemarkValue: '',
                othertitleResultList: [],
                othertitleResultValue: '',
                xmlDOM: '',
                dayRecord: '',
                entirRecord: '',
                timePointRecord: '',
                date: new Date(),
                formatString: 'yyyy-MM-dd hh:mm:ss',
                dateFormatString: 'yyyy-MM-dd',
                drugAllergyList: [1, 2, 3],
                remarkList: [1, 2, 3, 4, 5],
                painList: [],
                /*outPutValue: '',
                inHospitalValue: '',
                operationValue: '',
                stoolValue: '',
                temper: '',
                cool: '',
                timePoint: [],
                annotation: [{label: '请填写入院时间', value: 'field'}, {label: '请填写类别', value: 'radio'}],
                annotationValue: '',
                drugAllergy: [{label: '请填写药品名称', value: 'field'}, {label: '请填写结果', value: 'radio'}],
                drugAllergyValue: '',
                remark: [{label: '请填写描述内容', value: 'field'}, {label: '请填写备注', value: 'radio'}, {
                    label: '请填写结果',
                    value: 'field'
                }],
                remarkValue: '',*/
                measureTypeData: [],
                measuretype: '',
                timePointData: [],
                timePointValue: '',
                toptip: '',
                allergyIndex: 1,
                othertitleIndex: 1,
                allergy1: '',
                allergy2: '',
                allergy3: '',
                othertitle1: '',
                othertitle2: '',
                othertitle3: '',
                othertitle4: '',
                othertitle5: '',
                eventNo: this.$route.query.eventNo,
                patientId: this.$route.query.patientId,
                userId: this.$route.query.userId,
                userName: this.$route.query.userName,
                week: this.$route.query.week,
                serial: this.$route.query.serial,
                deptCode: this.$route.query.deptCode,
                timePoint: this.$route.query.timePoint,
                xmlDoc: ''
            }
        },

        created: function () {

        },

        methods: {
            //获取体征基本字典项
            getPdaTPzemrDict() {
                let vm = this;
                vm.$http.post('mobile/emr/emr/getPdaTPzemrDict', {
                    dictName: 'PDA_TPZEMR_CBO'
                }).then(res => {
                    if (res.status === 200) {
                        for (let i = 0; i < res.data.length; i++) {
                            if (res.data[i].babyFlag == "0") {
                                switch (res.data[i].nodeName) {
                                    case "MEASURETYPE":
                                        this.measureTypeData.push({
                                            label: res.data[i].nameText,
                                            value: res.data[i].nameValue
                                        });
                                        break;
                                    case "TIMEPOINT":
                                        this.timePointData.push({
                                            label: res.data[i].nameText == "" ? " " : res.data[i].nameText,
                                            value: res.data[i].nameValue
                                        });
                                        break;
                                    case "TEMPTYPE":
                                        this.dictData.push({label: res.data[i].nameText, value: res.data[i].nameValue});
                                        break;
                                    case "OUTPUTTITLE":
                                        this.outPutTitleList.push({
                                            label: res.data[i].nameText == "" ? " " : res.data[i].nameText,
                                            value: res.data[i].nameValue
                                        });
                                        break;
                                    case "INHOSPITALTYPE":
                                        this.inHospitalTypeList.push({
                                            label: res.data[i].nameText == "" ? " " : res.data[i].nameText,
                                            value: res.data[i].nameValue
                                        });
                                        break;
                                    case "OPERATIONDAY":
                                        this.operationDayList.push({
                                            label: res.data[i].nameText == "" ? " " : res.data[i].nameText,
                                            value: res.data[i].nameValue
                                        });
                                        break;
                                    case "STOOL":
                                        this.stoolData.push({
                                                label: res.data[i].nameText == "" ? " " : res.data[i].nameText,
                                                value: res.data[i].nameValue
                                            }
                                        );
                                        break;
                                    /*case "TIMEPOINT":
                                        this.timePoint.push({
                                            label: res.data[i].nameText == "" ? " " : res.data[i].nameText,
                                            value: res.data[i].nameValue
                                        });
                                        break;*/
                                    case "TOPTIPTYPE":
                                        this.toptipList.push({
                                            label: res.data[i].nameText == "" ? " " : res.data[i].nameText,
                                            value: res.data[i].nameValue
                                        });
                                        break;
                                    case "ALLERGY":
                                        this.allergyList.push({
                                            label: res.data[i].nameText == "" ? " " : res.data[i].nameText,
                                            value: res.data[i].nameValue
                                        });
                                        break;
                                    case "ALLERGYTYPE":
                                        this.resultList.push({
                                            label: res.data[i].nameText == "" ? " " : res.data[i].nameText,
                                            value: res.data[i].nameText
                                            // value: res.data[i].nameValue
                                        });
                                        break;
                                    case "OTHERTITLE1":
                                        this.othertitleList.push({
                                            label: res.data[i].nameText == "" ? " " : res.data[i].nameText,
                                            value: res.data[i].nameValue
                                        });
                                        break;
                                    case "OTHER1":
                                        this.othertitleRemarkList.push({
                                            label: res.data[i].nameText == "" ? " " : res.data[i].nameText,
                                            value: res.data[i].nameValue
                                        });
                                        break;
                                    case "OTHER1TYPE":
                                        this.othertitleResultList.push({
                                            label: res.data[i].nameText == "" ? " " : res.data[i].nameText,
                                            value: res.data[i].nameText
                                            // value: res.data[i].nameValue
                                        });
                                        break;
                                }
                            }
                        }
                    }
                })
            },

            //保存
            handleSaveClick() {
                Indicator.open({
                    text: '正在保存...'
                })
                let vm = this;
                /*vm.xmlDOM = this.createXMLDOM();
                let root;
                if (this.xmlDOM) {
                    root = this.xmlDOM.createElement('root');

                }*/
                let _dayRecord = vm.loadXMLDoc(this.dayRecord);
                let _entirRecord = vm.loadXMLDoc(this.entirRecord);
                let _timePointRecord = vm.loadXMLDoc(this.timePointRecord);
                let root = _dayRecord.getElementsByTagName("root"), root2 = _entirRecord.getElementsByTagName("root"),
                    root3 = _timePointRecord.getElementsByTagName("root");
                let nodeName;
                for (let i = 0; i < root[0].childNodes.length; i++) {
                    nodeName = root[0].childNodes[i].nodeName;
                    if (nodeName === 'datatype') {
                        _dayRecord.getElementsByTagName(nodeName)[0].textContent = 2;
                        continue;
                    } else if (nodeName === 'date' || nodeName === 'intime') {
                        if (typeof vm[nodeName] === 'object') {
                            _dayRecord.getElementsByTagName(nodeName)[0].textContent = vm[nodeName].format('yyyy-MM-dd'); //vm[nodeName].toJSON().substr(0, 10);
                        } else {
                            _dayRecord.getElementsByTagName(nodeName)[0].textContent = vm[nodeName] ? vm[nodeName] : "";
                        }
                        continue;
                    }
                    switch (nodeName) {
                        case "bloodpressure1":
                            vm.bloodpressure1 = vm.bloodpressure1high + '/' + vm.bloodpressure1lower;
                            break;
                        case "bloodpressure2":
                            vm.bloodpressure2 = this.bloodpressure2high + '/' + vm.bloodpressure2lower;
                            break;
                        case "bloodpressure3":
                            vm.bloodpressure3 = vm.bloodpressure3high + '/' + vm.bloodpressure3lower;
                            break;
                    }
                    _dayRecord.getElementsByTagName(nodeName)[0].textContent = vm[nodeName] ? vm[nodeName] : "";
                }
                for (let i = 0; i < root2[0].childNodes.length; i++) {
                    nodeName = root2[0].childNodes[i].nodeName;
                    if (nodeName === 'datatype') {
                        _entirRecord.getElementsByTagName(nodeName)[0].textContent = 2;
                        continue;
                    } else if (nodeName === 'date' || nodeName === 'intime') {
                        if (typeof vm[nodeName] === 'object') {
                            _entirRecord.getElementsByTagName(nodeName)[0].textContent = vm[nodeName].format('yyyy-MM-dd'); //vm[nodeName].toJSON().substr(0, 10);
                        } else {
                            _entirRecord.getElementsByTagName(nodeName)[0].textContent = vm[nodeName] ? vm[nodeName] : "";
                        }
                        continue;
                    }
                    _entirRecord.getElementsByTagName(nodeName)[0].textContent = vm[nodeName] ? vm[nodeName] : "";
                }
                for (let i = 0; i < root3[0].childNodes.length; i++) {
                    nodeName = root3[0].childNodes[i].nodeName;
                    if (nodeName === 'datatype') {
                        _timePointRecord.getElementsByTagName(nodeName)[0].textContent = 2;
                        continue;
                    } else if (nodeName === 'date' || nodeName === 'intime') {
                        if (typeof vm[nodeName] === 'object') {
                            _timePointRecord.getElementsByTagName(nodeName)[0].textContent = vm[nodeName].format('yyyy-MM-dd'); //vm[nodeName].toJSON().substr(0, 10);
                        } else {
                            _timePointRecord.getElementsByTagName(nodeName)[0].textContent = vm[nodeName] ? vm[nodeName] : "";
                        }
                        continue;
                    }
                    _timePointRecord.getElementsByTagName(nodeName)[0].textContent = vm[nodeName] ? vm[nodeName] : "";
                }
                let tendEMRModelStr = {};
                tendEMRModelStr.timePointRecord = this.XML2String(_timePointRecord);
                tendEMRModelStr.entirRecord = this.XML2String(_entirRecord);
                tendEMRModelStr.dayRecord = this.XML2String(_dayRecord);
                tendEMRModelStr.date = this.date.toJSON().substr(0, 10);
                vm.xmlDoc = this.createXMLDOM();
                this.addChildNode('patientid', '3001927434'); //this.patientId
                this.addChildNode('eventno', '401957002'); //this.eventNo
                this.addChildNode('serial', 0); //this.serial
                this.addChildNode('week', 348); //this.week
                this.addChildNode('username', '系统管理员'); //this.userName
                this.addChildNode('userid', '12917'); //this.userId
                this.addChildNode('usertechtitle', null);
                this.addChildNode('computername', null);
                this.addChildNode('computerip', null);
                tendEMRModelStr.sickTempParam = "<?xml version='1.0' encoding='UTF-16' standalone='no' ?>" + vm.XML2String(vm.xmlDoc);

                vm.$http.post('mobile/emr/emr/saveCommTpRecord', {
                    tendEMRModelStr: tendEMRModelStr
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

            //获取体征内容
            getSignEntryContent(val) {
                let vm = this, meaTime;
                if (typeof vm.date === 'object') {
                    meaTime = vm.date.format('yyyy-MM-dd');
                } else if (typeof vm.date === "string") {
                    meaTime = vm.date.substr(0, 10);
                }
                vm.$http.post('mobile/emr/emr/getCommTpRecord', {
                    tendEMRModelStr: '{\'PatientID\':\'3001927434\',\'EventNo\':\'401957002\',\'TimePoint\':' + val + ',\'Date\': \'' + meaTime + '\'}'
                }).then(res => {
                    let xx = new x2js(), x = xx.xml2js(res.data.dayRecord), x1 = xx.xml2js(res.data.entirRecord),
                        x2 = xx.xml2js(res.data.timePointRecord);
                    this.dayRecord = res.data.dayRecord;
                    this.entirRecord = res.data.entirRecord;
                    this.timePointRecord = res.data.timePointRecord;
                    for (let item in x.root) {
                        vm[item] = x.root[item];
                    }
                    for (let item in x1.root) {
                        vm[item] = x1.root[item];
                    }
                    for (let item in x2.root) {
                        vm[item] = x2.root[item];
                    }
                    vm.intime === "" ? vm.intime = new Date() : new Date(vm.intime);
                    vm.date === "" ? vm.date = new Date() : new Date(vm.date);
                    vm.timePointValue = val;
                })
            },

            //上注释
            toptipMethod() {
                this.$refs["zm-container-1"].style.display = "none";
                this.$refs["zm-container-2"].style.display = "";
            },

            //药物过敏
            allergyMethod(index) {
                this.allergyIndex = index;
                this.$refs["zm-container-1"].style.display = "none";
                this.$refs["zm-container-3"].style.display = "";
            },

            //补充说明
            othertitle1Method(index) {
                this.othertitleIndex = index;
                this.$refs["zm-container-1"].style.display = "none";
                this.$refs["zm-container-4"].style.display = "";
            },

            //上注释 取消
            cancel() {
                this.$refs["zm-container-1"].style.display = "";
                this.$refs["zm-container-2"].style.display = "none";
            },

            //药物过敏 取消
            cancel2() {
                this.$refs["zm-container-1"].style.display = "";
                this.$refs["zm-container-3"].style.display = "none";
            },

            //补充说明 取消
            cancel3() {
                this.$refs["zm-container-1"].style.display = "";
                this.$refs["zm-container-4"].style.display = "none";
            },

            //JS创建xml对象
            createXMLDOM() {
                var xmlDOM;
                if (window.ActiveXObject) {
                    xmlDOM = new ActiveXObject('Microsoft.XMLDOM');
                } else if (document.implementation
                    && document.implementation.createDocument) {
                    xmlDOM = document.implementation.createDocument('', 'root', null);
                } else {
                    Toast({
                        message: '您的浏览器不支持文档对象XMLDOM',
                        iconClass: 'mintui mintui-error'
                    })
                    return;
                }
                return xmlDOM;
            },

            //解析xml文件
            /*loadXMLDoc(xmlStr){
                let xhttp;
                if (window.XMLHttpRequest){
                    xhttp = new XMLHttpRequest();
                }else{
                    xhttp = new ActiveXObject("Microsoft.XMLHTTP");
                }
                // xhttp.open("GET",xmlStr,false);
                // xhttp.send("");
                xhttp.loadXML(xmlStr);
                return xhttp.responseXML;
            },*/

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

            //上注释 确定
            determine() {
                this.toptip = this.toptipValue + ' ' + this.toptipValue2;
                this.$refs.toptip.textContent = this.toptip;
                this.cancel();
            },

            //药物过敏 确定
            determine2() {
                this['allergy' + this.allergyIndex] = this.allergyValue + ' ' + this.resultValue;
                this.$refs['allergy' + this.allergyIndex][0].textContent = this['allergy' + this.allergyIndex];
                this.cancel2();
            },

            //补充说明 确定
            determine3() {
                this['othertitle' + this.othertitleIndex] = this.othertitleValue + ' ' + this.othertitleRemarkValue + ' ' + this.othertitleResultValue;
                this.$refs['othertitle' + this.othertitleIndex][0].textContent = this['othertitle' + this.othertitleIndex];
                this.cancel3();
            },

            //添加XML子节点
            addChildNode(node, text) {
                let newEle = this.xmlDoc.createElement(node),
                    newText = this.xmlDoc.createTextNode(text);
                newEle.appendChild(newText);
                this.xmlDoc.firstChild.appendChild(newEle);
            }
        },

        mounted() {
            this.getPdaTPzemrDict();
            for (let i = 1; i <= 10; i++) {
                this.painList.push({label: i, value: i});
            }

            //体征录入修改跳转过来
            if (this.timePoint) {
                this.getSignEntryContent(this.timePoint);
            }
        },

        beforeDestroy: function () {

        },

        watch: {
            timePointValue(val) {
                this.getSignEntryContent(val);
            },

            pluseflag(val) {
                parseInt(val) === 0 ? this.pluseflag = false : this.pluseflag = true;
            },

            breatheflag(val){
                parseInt(val) === 0 ? this.breatheflag = false : this.breatheflag = true;
            },

            tempsameflag(val){
                parseInt(val) === 0 ? this.tempsameflag = false : this.tempsameflag = true;
            },

            bloodpressure1NotIn(val){
                parseInt(val) === 0 ? this.bloodpressure1NotIn = false : this.bloodpressure1NotIn = true;
            },

            bloodpressure2NotIn(val){
                parseInt(val) === 0 ? this.bloodpressure2NotIn = false : this.bloodpressure2NotIn = true;
            },

            bloodpressure3NotIn(val){
                parseInt(val) === 0 ? this.bloodpressure3NotIn = false : this.bloodpressure3NotIn = true;
            }
        }
    }
</script>