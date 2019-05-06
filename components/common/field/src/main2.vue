<template>
    <div>
        <KeyboardAwareScrollView>
            <View>
                <TextInput />
            </View>
        </KeyboardAwareScrollView>
    </div>
</template>

<script>
    import { Field } from 'mint-ui'
    import Vue from 'vue'
    import Dirty from '~/components/mixins/dirty'
    import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

    export default {
        name: 'ZmField',
        componentName: 'ZmField',
        mixins: [Field]
    }
</script>

<style scoped>

</style>