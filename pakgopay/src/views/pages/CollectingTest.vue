<script setup>
import SvgIcon from "@/components/SvgIcon/index.vue";
</script>

<template>
  <div class="main-title">{{ $t('collectingTest.title') }}</div>
  <div class="main-views-container collecting-test-container">
    <div class="main-views-form collecting-test-form-wrap">
      <el-form ref="testFormRef" :model="apiTestInfo" :rules="formRules" label-width="150px">
        <el-row>
          <el-col :span="24">
            <el-form-item prop="merchantId">
              <template #label>
                <span class="form-label">{{ $t('orderCommon.form.merchant') }}</span>
              </template>
              <el-select
                v-model="apiTestInfo.merchantId"
                :placeholder="$t('collectingTest.placeholder.merchant')"
                style="width: 300px"
                @change="handleMerchantChange"
              >
                <el-option
                  v-for="item in merchantInfos"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item prop="merchantOrderNo">
              <template #label>
                <span class="form-label">{{ $t('orderCommon.form.merchantOrderNo') }}</span>
              </template>
              <el-input v-model="apiTestInfo.merchantOrderNo" style="width: 300px"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item prop="paymentNo">
              <template #label>
                <span class="form-label">{{ $t('orderCommon.form.channelName') }}</span>
              </template>
              <el-select
                v-model="apiTestInfo.paymentNo"
                :placeholder="$t('collectingTest.placeholder.channel')"
                style="width: 300px"
                :disabled="!apiTestInfo.merchantId"
                @change="handlePaymentChange"
              >
                <el-option
                  v-for="item in pathChannelInfos"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item prop="amount">
              <template #label>
                <span class="form-label">{{ $t('orderCommon.form.amount') }}</span>
              </template>
              <el-input v-model="apiTestInfo.amount" type="number" min="1" style="width: 300px"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item>
              <template #label>
                <span class="form-label">{{ $t('common.currency') }}</span>
              </template>
              <el-input v-model="apiTestInfo.currency" style="width: 300px" disabled/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item prop="manualOrderType">
              <template #label>
                <span class="form-label">{{ $t('orderCommon.form.thirdPartyCall') }}</span>
              </template>
              <el-radio-group v-model="apiTestInfo.manualOrderType" style="width: 300px">
                <el-radio :label="3">{{ $t('common.yes') }}</el-radio>
                <el-radio :label="4">{{ $t('common.no') }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item prop="responseType">
              <template #label>
                <span class="form-label">{{ $t('orderCommon.form.responseType') }}</span>
              </template>
              <el-radio-group v-model="apiTestInfo.responseType" style="width: 300px">
                <el-radio :label="1">{{ $t('collectingTest.option.json') }}</el-radio>
                <el-radio :label="2">{{ $t('collectingTest.option.redirect') }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item prop="notificationUrl">
              <template #label>
                <span class="form-label">{{ $t('orderCommon.form.notificationUrl') }}</span>
              </template>
              <el-input v-model="apiTestInfo.notificationUrl" style="width: 300px"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item>
              <template #label>
                <span class="form-label">{{ $t('orderCommon.form.callResult') }}</span>
              </template>
              <el-input
                v-model="apiTestResult"
                type="textarea"
                :rows="6"
                readonly
                style="width: 300px"
              />
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
    </div>

    <div class="collecting-test-footer">
      <el-button class="action-btn" @click="reset">{{ $t('common.reset') }}</el-button>
      <el-button
        class="action-btn"
        type="primary"
        :loading="submitting"
        :disabled="submitting"
        @click="submit"
      >
        {{ $t('common.submit') }}
      </el-button>
    </div>
  </div>

  <el-dialog v-model="googleConfirmVisible" :title="$t('common.googleCode')" width="480px" class="google-confirm-dialog">
    <el-form ref="googleConfirmFormRef" :model="googleConfirmData" :rules="googleConfirmRules" label-width="110px" class="google-confirm-form">
      <el-form-item :label="$t('common.googleCode')" prop="googleCode">
        <el-input v-model="googleConfirmData.googleCode" style="width: 200px" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer google-confirm-footer">
        <el-button @click="closeGoogleConfirm">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="confirmSubmit">{{ $t('common.confirm') }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import {
  getMerchantInfo,
  manualCreateCollectionOrder,
  queryMerchantAvailableChannels
} from "@/api/interface/backendInterface.js";

function buildDefaultForm() {
  return {
    merchantId: "",
    merchantOrderNo: "",
    paymentNo: "",
    amount: "",
    currency: "",
    manualOrderType: 4,
    responseType: 1,
    notificationUrl: ""
  }
}

export default {
  data() {
    return {
      apiTestInfo: buildDefaultForm(),
      merchantInfos: [],
      pathChannelInfos: [],
      pathChannelMetaMap: {},
      apiTestResult: "",
      googleConfirmVisible: false,
      googleConfirmData: {
        googleCode: ""
      },
      submitting: false,
      formRules: {
        merchantId: [{ required: true, message: this.$t('orderCommon.validation.merchantIdRequired'), trigger: 'change' }],
        merchantOrderNo: [{ required: true, message: this.$t('orderCommon.validation.merchantOrderNoRequired'), trigger: 'blur' }],
        paymentNo: [{ required: true, message: this.$t('orderCommon.validation.channelNameRequired'), trigger: 'change' }],
        amount: [{ required: true, message: this.$t('orderCommon.validation.amountRequired'), trigger: 'blur' }],
        manualOrderType: [{ required: true, message: this.$t('orderCommon.validation.manualOrderTypeRequired'), trigger: 'change' }],
        responseType: [{ required: true, message: this.$t('orderCommon.validation.responseTypeRequired'), trigger: 'change' }],
        notificationUrl: [{ required: true, message: this.$t('orderCommon.validation.notificationUrlRequired'), trigger: 'blur' }]
      },
      googleConfirmRules: {
        googleCode: [{ required: true, message: this.$t('common.googleCodeRequired'), trigger: 'blur' }]
      }
    }
  },
  methods: {
    reset() {
      this.apiTestInfo = buildDefaultForm()
      this.pathChannelInfos = []
      this.pathChannelMetaMap = {}
      this.apiTestResult = ""
      this.googleConfirmVisible = false
      this.googleConfirmData.googleCode = ""
      this.$nextTick(() => this.$refs.testFormRef?.clearValidate())
    },
    notifyError(message) {
      this.$notify({
        title: this.$t('common.error'),
        type: 'error',
        duration: 3000,
        position: 'bottom-right',
        message: message || this.$t('common.requestFailed')
      })
    },
    notifySuccess(message) {
      this.$notify({
        title: this.$t('common.success'),
        type: 'success',
        duration: 3000,
        position: 'bottom-right',
        message: message || this.$t('orderCommon.message.createSuccess')
      })
    },
    extractAvailableChannelList(rawData) {
      if (!rawData) return []
      if (Array.isArray(rawData)) return rawData
      if (typeof rawData === 'string') {
        try {
          const parsed = JSON.parse(rawData)
          if (Array.isArray(parsed)) return parsed
          if (Array.isArray(parsed?.paymentDtoList)) return parsed.paymentDtoList
          return []
        } catch (e) {
          return []
        }
      }
      if (Array.isArray(rawData.paymentDtoList)) return rawData.paymentDtoList
      return []
    },
    handleMerchantChange(merchantId) {
      this.apiTestInfo.paymentNo = ""
      this.apiTestInfo.currency = ""
      this.pathChannelInfos = []
      this.pathChannelMetaMap = {}
      if (!merchantId) return
      queryMerchantAvailableChannels({ merchantId }).then((res) => {
        if (res.status !== 200 || res.data.code !== 0) {
          this.notifyError(res.data?.message)
          return
        }
        const channels = this.extractAvailableChannelList(res.data?.data)
          .filter((item) => {
            const supportType = Number(item?.supportType)
            return Number.isNaN(supportType) || supportType === 0 || supportType === 2
          })
        this.pathChannelInfos = channels.map((item) => ({
          value: item.paymentNo || item.paymentId || item.id,
          label: item.channelName || item.paymentName || String(item.paymentNo || item.paymentId || item.id || ''),
          currency: String(item.currency || item.currencyType || '').trim()
        })).filter((item) => item.value)
        this.pathChannelMetaMap = {}
        this.pathChannelInfos.forEach((item) => {
          this.pathChannelMetaMap[String(item.value)] = item
        })
      }).catch((err) => {
        this.notifyError(err.message)
      })
    },
    handlePaymentChange(value) {
      const meta = this.pathChannelMetaMap[String(value)] || {}
      this.apiTestInfo.currency = String(meta.currency || '').trim()
    },
    resolvePayUrl(source) {
      if (!source) return ''
      if (typeof source === 'string') {
        const raw = source.trim()
        if (!raw) return ''
        if (raw.startsWith('{') || raw.startsWith('[')) {
          try {
            return this.resolvePayUrl(JSON.parse(raw))
          } catch (e) {
            const urlMatch = raw.match(/https?:\/\/[^\s"'}]+/i)
            return urlMatch ? urlMatch[0].trim() : ''
          }
        }
        if (/^https?:\/\//i.test(raw)) return raw
        return ''
      }
      if (typeof source !== 'object') return ''
      const direct = String(source.payUrl || source.payURL || source.payurl || '').trim()
      if (direct) return direct
      if (source.data) return this.resolvePayUrl(source.data)
      return ''
    },
    submit() {
      if (this.submitting) return
      this.$refs.testFormRef.validate((valid) => {
        if (!valid) return
        this.googleConfirmVisible = true
        this.$nextTick(() => this.$refs.googleConfirmFormRef?.clearValidate())
      })
    },
    closeGoogleConfirm() {
      this.googleConfirmVisible = false
      this.googleConfirmData.googleCode = ""
      this.$refs.googleConfirmFormRef?.resetFields()
    },
    confirmSubmit() {
      if (this.submitting) return
      this.$refs.googleConfirmFormRef.validate((valid) => {
        if (!valid) return
        const payload = {
          merchantId: this.apiTestInfo.merchantId,
          merchantOrderNo: this.apiTestInfo.merchantOrderNo,
          paymentNo: this.apiTestInfo.paymentNo,
          amount: this.apiTestInfo.amount,
          currency: this.apiTestInfo.currency,
          manualOrderType: this.apiTestInfo.manualOrderType,
          notificationUrl: this.apiTestInfo.notificationUrl,
          googleCode: this.googleConfirmData.googleCode
        }
        this.googleConfirmVisible = false
        this.submitting = true
        manualCreateCollectionOrder(payload).then((res) => {
          this.apiTestResult = JSON.stringify(res?.data ?? {}, null, 2)
          if (res.status === 200 && res.data.code === 0) {
            this.notifySuccess(res.data.message)
            const payUrl = this.resolvePayUrl(res.data?.data)
            if (payUrl && Number(this.apiTestInfo.responseType) === 2) {
              window.open(payUrl, '_blank', 'noopener,noreferrer')
            }
            return
          }
          this.notifyError(res.data?.message)
        }).catch((err) => {
          this.notifyError(err.message)
        }).finally(() => {
          this.submitting = false
          this.googleConfirmData.googleCode = ""
          this.$refs.googleConfirmFormRef?.resetFields()
        })
      })
    }
  },
  mounted() {
    getMerchantInfo({ pageSize: 1000 }).then((res) => {
      if (res.status === 200 && res.data.code === 0) {
        const allData = JSON.parse(res.data.data || '{}')
        const list = allData?.merchantInfoDtoList || []
        this.merchantInfos = list.map((item) => ({
          value: item.userId,
          label: item.merchantName || item.accountName || String(item.userId || '')
        }))
        return
      }
      this.notifyError(res.data?.message)
    }).catch((err) => {
      this.notifyError(err.message)
    })
  }
}
</script>

<style scoped>
@import "@/assets/base.css";

.form-label {
  color: dodgerblue;
  font-size: larger;
}

.collecting-test-container {
  background-color: white;
  height: 80%;
  display: flex;
  flex-direction: column;
}

.collecting-test-form-wrap {
  display: flex;
  justify-content: center;
  padding: 20px 0 12px;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

.collecting-test-footer {
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  border-top: solid 2px gray;
  height: 100px;
  flex-shrink: 0;
}

.action-btn {
  width: 100px;
}

.collecting-test-footer .action-btn:first-child {
  margin-left: 30%;
}

.collecting-test-footer .action-btn:last-child {
  margin-right: 30%;
}

.google-confirm-form {
  padding-top: 6px;
  padding-bottom: 6px;
  display: flex;
  justify-content: center;
}

.google-confirm-form :deep(.el-form-item) {
  margin-bottom: 14px;
  justify-content: center;
}

.google-confirm-footer {
  margin-top: 16px;
}
</style>
