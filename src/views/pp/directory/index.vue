<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="default" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="问卷名称" prop="surveyName">
        <el-input
          v-model="queryParams.surveyName"
          placeholder="请输入问卷名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属模块" prop="surveyModel">
        <el-input
          v-model="queryParams.surveyModel"
          placeholder="请输入所属模块"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="问卷状态" prop="surveyState">
        <el-select v-model="queryParams.surveyState" placeholder="请选择问卷状态" @change="handleQuery">
          <el-option label="设计中" value="0"></el-option>
          <el-option label="收集中" value="1"></el-option>
          <el-option label="收集结束" value="2"></el-option>
        </el-select>
      </el-form-item>
<!--      <el-form-item label="问卷状态" prop="surveyState">
        <el-input
          v-model="queryParams.surveyState"
          placeholder="请输入问卷状态"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->
      <el-form-item>
        <el-button type="primary" icon="search" size="default" @click="handleQuery">搜索</el-button>
        <el-button icon="refresh" size="default" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" size="default" @click="handleAdd" v-hasPermi="['pp:directory:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          size="default"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['pp:directory:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          size="default"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['pp:directory:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="download"
          size="default"
          @click="handleExport"
          v-hasPermi="['pp:directory:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="directoryList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
<!--      <el-table-column label="" align="center" prop="id" />-->
      <el-table-column min-width="40%" label="问卷" align="center" prop="surveyName" />
      <el-table-column min-width="25%" label="答卷数" align="center" prop="answerNum" />
      <el-table-column min-width="25%" label="状态" align="center" prop="surveyState">
        <template #default="scope">
          <el-tag v-if="scope.row.surveyState === 0" >设计中</el-tag>
          <el-tag v-else-if="scope.row.surveyState === 1" type="success" >收集中</el-tag>
          <el-tag v-else-if="scope.row.surveyState === 2" type="info" >收集结束</el-tag>
        </template>
      </el-table-column>
      <el-table-column min-width="25%" label="创建时间" align="center" prop="createDate"/>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-tooltip effect="dark" content="编辑问卷" placement="top">
            <el-button size="default" content="编辑问卷" icon="edit" @click="buttonClickA(`/static/diaowen/design.html?surveyId=${scope.row.id}`)" ></el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="答卷地址" placement="top">
            <el-button size="default" icon="share" @click="handlePush(`/pp/directory/DwAnswerUrl?surveyId=${scope.row.id}`)"></el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="答卷数据" placement="top">
            <el-button size="default" icon="DataLine" @click="handlePush(`/dw/survey/d/chart/${scope.row.id}`)"></el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="预览问卷" placement="top">
            <el-button size="default" icon="view" @click="buttonClickA(`/static/diaowen/preview.html?surveyId=${scope.row.id}`)"></el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="复制问卷" placement="top">
            <el-button size="default" icon="CopyDocument" @click="handleCopy(scope.$index, scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="删除" placement="top">
            <el-button size="default" icon="delete" @click="handleDelete(scope.row)" v-hasPermi="['pp:directory:remove']"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <pagination
        v-show="total > 0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
    />
<!--  这好像是VUE2的用法 -->
<!--    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />-->


    <div>
      <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" append-to-body width="40%" >
        <el-form :model="form" label-position="top">
          <el-form-item :label-width="formLabelWidth" label="问卷标题" >
            <el-input v-model="form.name" autocomplete="off" placeholder="请输入问卷标题" ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleDialogConfirm">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 创建问卷 -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form :model="form" :rules="rules" label-width="80px">
          <el-form-item :label-width="formLabelWidth" label="问卷标题" prop="name">
            <el-input v-model="form.name" autocomplete="off" placeholder="请输入问卷标题" maxlength="30" />
          </el-form-item>
      </el-form>
      <template #footer>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleDialogConfirm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { listDirectory, getDirectory, delDirectory, addDirectory, updateDirectory,dwSurveyCreate } from "@/api/pp/directory";

export default {
  name: "Directory",
  dicts: ['true_or_false'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 我的问卷表格数据
      directoryList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        surveyName: null,
        surveyModel: null,
        surveyState: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      // 表单参数
      dialogTitle: '创建问卷',
      dialogFormVisible: false,
      formLabelWidth: '120px'
    };
  },
  created() {
    this.getList();
  },
  methods: {
    buttonClickA (href) {
      window.location.href = href
    },
    handlePush: function (to) {
      this.$router.push(to)
    },
    handleDialogConfirm () {
      if (this.form.id === null) {
        this.createSurvey()
      } else {
        this.copySurvey(this.form.id)
      }
    },
    createSurvey () {
      const data = {surveyName: this.form.name}
      dwSurveyCreate(data).then((response) => {
        const resultData = response.data
        if (response.code === 200) {
          this.dialogFormVisible = false
          this.$confirm('问卷创建成功，点击“继续编辑问卷”进入问卷编辑。', '系统提示', {confirmButtonText: '继续编辑问卷'})
              .then(({value}) => {window.location.href=`/static/diaowen/design.html?surveyId=${resultData.id}`})
              .catch(() => {this.queryList(1)})
        } else {
          this.$message.error('创建问卷失败')
        }
      })
    },
    /** ============================================================================================================ */
    /** 查询我的问卷列表 */
    getList() {
      this.loading = true;
      listDirectory(this.queryParams).then(response => {
        this.directoryList = response.records;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        surveyName: null,
        surveyModel: null,
        surveyState: null,
        userId: null,
        sid: null,
        anItemLeastNum: null,
        answerNum: null,
        createDate: null,
        dirType: null,
        excerptNum: null,
        htmlPath: null,
        jsonPath: null,
        isShare: null,
        parentId: null,
        surveyDetailId: null,
        surveyQuNum: null,
        surveyTag: null,
        viewAnswer: null,
        visibility: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "创建问卷";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getDirectory(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改我的问卷";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateDirectory(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addDirectory(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除我的问卷编号为"' + ids + '"的数据项？').then(function() {
        return delDirectory(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('pp/directory/export', {
        ...this.queryParams
      }, `directory_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
