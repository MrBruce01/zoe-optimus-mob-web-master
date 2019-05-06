import Container from './container-layout/container'
import Aside from './container-layout/aside'
import Footer from './container-layout/footer'
import Header from './container-layout/header'
import Main from './container-layout/main'
import DatetimePicker from './datetime-picker'
import Checklist from './checklist'
import Radio from './radio'
import Field from './field'
import TextfieldList from './textfield-list'
import Keyboard from './keyboard'
import RadioSpec from './radio-spec'

const install = function (Vue, config = {}) {
  if (install.installed) return
  Vue.component(Container.name, Container)
  Vue.component(Aside.name, Aside)
  Vue.component(Footer.name, Footer)
  Vue.component(Header.name, Header)
  Vue.component(Main.name, Main)
  Vue.component(DatetimePicker.name, DatetimePicker)
  Vue.component(Checklist.name, Checklist)
  Vue.component(Radio.name, Radio)
  Vue.component('ZmField', Field)
  Vue.component(TextfieldList.name, TextfieldList)
  Vue.component(Keyboard.name, Keyboard)
  Vue.component(RadioSpec.name, RadioSpec)
}
export default install
