<template>
  <div class="form">
    <el-form
      ref="form"
      :rules="rules"
      :model="form"
      label-width="12em"
      @keypress.enter.native="getProjectInfo"
    >
      <el-form-item
        label="プロジェクト識別子"
        prop="project"
        :error="errorMessage"
      >
        <el-input
          v-model="form.project"
          :disabled="disabledProject"
          @blur="getProjectInfo"
        />
      </el-form-item>

      <el-collapse-transition>
        <div v-show="showForm">
          <el-form-item label="トラッカー" prop="tracker_id">
            <el-select
              v-model="form.tracker_id"
              clearable
              placeholder="選択してください"
            >
              <el-option
                v-for="item in trackers"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="題名" prop="subject">
            <el-input v-model="form.subject" />
          </el-form-item>

          <el-form-item label="説明" prop="description">
            <el-input
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 12 }"
              v-model="form.description"
            />
          </el-form-item>

          <el-row>
            <el-col :span="12">
              <el-form-item label="ステータス" prop="status_id">
                <el-select
                  v-model="form.status_id"
                  placeholder="選択してください"
                >
                  <el-option
                    v-for="item in statueses"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="優先度" prop="priority_id">
                <el-select
                  v-model="form.priority_id"
                  placeholder="選択してください"
                >
                  <el-option
                    v-for="item in priorities"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="担当者" prop="assigned_to_id">
                <el-select
                  v-model="form.assigned_to_id"
                  clearable
                  placeholder="選択してください"
                >
                  <el-option
                    v-for="item in users"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="カテゴリ" prop="category_id">
                <el-select
                  v-model="form.category_id"
                  clearable
                  placeholder="選択してください"
                >
                  <el-option
                    v-for="item in categories"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="対象バージョン" prop="fixed_version_id">
            <el-select
              v-model="form.fixed_version_id"
              clearable
              placeholder="選択してください"
            >
              <el-option
                v-for="item in versions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="success" @click="checkUrl">Test</el-button>
            <el-button @click="onReset('form')">Reset</el-button>
          </el-form-item>

          <el-row>
            <el-col :span="21" :offset="2">
              <el-input
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 12 }"
                v-model="ticketUrl"
                @focus="selectUrl"
              />
            </el-col>
          </el-row>
        </div>
      </el-collapse-transition>

      <div v-show="showSearch">
        <el-form-item label="" prop="project">
          <el-button
            type="primary"
            icon="el-icon-search"
            size="small"
            :loading="loading"
            @click="getProjectInfo"
          >
            search
          </el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import {
  Alert,
  Button,
  Col,
  CollapseTransition,
  Form,
  FormItem,
  Input,
  Option,
  Row,
  Select,
} from 'element-ui';
import { ElForm } from 'element-ui/types/form';
import axios from 'axios';

interface Opt {
  id: number;
  name: string;
}

@Component({
  components: {
    'el-alert': Alert,
    'el-button': Button,
    'el-col': Col,
    'el-collapse-transition': CollapseTransition,
    'el-form': Form,
    'el-form-item': FormItem,
    'el-input': Input,
    'el-option': Option,
    'el-row': Row,
    'el-select': Select,
  },
})
export default class FormElement extends Vue {
  public $refs!: { [key: string]: ElForm };

  private errorMessage = '';
  private loading = false;
  private showForm = false;
  private showSearch = true;
  private disabledProject = false;

  private host: string = process.env.VUE_APP_REDMINE_HOST;
  private proxyPort = process.env.VUE_APP_PROXY_PORT || '1337';
  private apiUrl: string = `http://localhost:${this.proxyPort}/${this.host}/projects`;
  private baseUrl: string = `https://${this.host}/projects`;
  private accessKey: string = `key=${process.env.VUE_APP_REDMINE_API_ACCESS_KEY}`;

  private rules: { [key: string]: any } = {
    project: [{ required: true, message: 'ff', trigger: 'blur' }],
  };

  private form: { [key: string]: any } = {
    project: '',
    tracker_id: '',
    subject: '',
    description: '',
    status_id: 1,
    priority_id: 4,
    assigned_to_id: '',
    category_id: '',
    fixed_version_id: '',
  };

  private trackers: Opt[] = [];
  private categories: Opt[] = [];
  private users: Opt[] = [];
  private versions: Opt[] = [];
  private statueses: Opt[] = [
    {
      id: 1,
      name: '新規',
    },
  ];
  private priorities: Opt[] = [
    {
      id: 3,
      name: '低め',
    },
    {
      id: 4,
      name: '通常',
    },
    {
      id: 5,
      name: '高め',
    },
    {
      id: 6,
      name: '急いで',
    },
    {
      id: 7,
      name: '今すぐ',
    },
  ];

  get ticketUrl(): string {
    const keys = Object.keys(this.form);
    keys.shift();
    const queries: string[] = [];
    keys.forEach((key: string) => {
      const val = this.form[key];
      if (val === '') {
        return;
      }

      const s = encodeURI(`issue[${key}]=${val}`);
      queries.push(s);
    });

    const project = this.form.project;
    const q = queries.join('&');

    return `${this.baseUrl}/${project}/issues/new?${q}`;
  }

  private makeUrl(value: string, addition: string = ''): string {
    const key = `key=${process.env.VUE_APP_REDMINE_API_ACCESS_KEY}`;
    return `${this.apiUrl}/${value}?${key}${addition}`;
  }

  public mounted(): void {
    console.log('mounted');
  }

  public getProjectInfo() {
    const project = this.form.project;
    this.errorMessage = '';
    this.loading = true;

    if (project === '') {
      this.loading = false;
      this.errorMessage = 'プロジェクト識別子を入力してください。';
      return;
    }

    const projectUrl = this.makeUrl(
      `${project}.json`,
      '&include=trackers,issue_categories'
    );
    const memberUrl = this.makeUrl(`${project}/memberships.json`);
    const versionUrl = this.makeUrl(`${project}/versions.json`);

    Promise.all([
      axios.get(projectUrl),
      axios.get(memberUrl),
      axios.get(versionUrl),
    ])
      .then(results => {
        this.showForm = true;

        this.trackers = results[0].data.project.trackers;
        this.categories = results[0].data.project.issue_categories;

        const users: any[] = [];
        results[1].data.memberships.forEach((v: any) => {
          users.push(v.user);
        });
        this.users = users;

        const versions: any[] = [];
        results[2].data.versions.forEach((v: any) => {
          if (v.status === 'open') {
            versions.push({
              id: v.id,
              name: v.name,
            });
          }
        });
        this.versions = versions;

        this.loading = false;
        this.showSearch = false;
        this.disabledProject = true;
      })
      .catch(error => {
        this.showForm = false;
        this.loading = false;
        this.errorMessage =
          '入力した識別子のプロジェクトが存在しません。識別子を確認してください。';
        console.log(error);
      });
  }

  public selectUrl(e: any): void {
    // TODO copy url
    e.target.select();
  }

  public checkUrl(): void {
    window.open(this.ticketUrl, '_blank');
  }

  public onReset(formName: string): void {
    this.$refs[formName].resetFields();
    this.showForm = false;
    this.showSearch = true;
    this.disabledProject = false;
  }
}
</script>
<style>
.el-form-item__content {
  text-align: left;
}
.el-form .el-alert .el-alert__description {
  font-weight: bold;
  font-size: 1rem;
}
</style>
