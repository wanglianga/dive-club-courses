import { ref, reactive, computed } from 'vue';
import type {
  HealthRiskRecord,
  HealthRiskStatus,
  HealthRiskStep,
  HealthDeclarationAnswers,
  HealthDeclaration,
  CourseLevel,
} from '@/data';
import { healthDeclarations } from '@/data';

const healthRiskRecords = ref<HealthRiskRecord[]>([
  {
    id: 'hr-001',
    studentId: 'stu-001',
    studentName: '张小海',
    declarationAnswers: {
      'h-1': 'no',
      'h-2': 'yes',
      'h-3': 'no',
      'h-4': 'no',
      'h-5': 'no',
      'h-6': 'no',
      'h-7': 'no',
      'h-8': 'no',
    },
    warningItems: ['h-2'],
    status: 'advisor_review',
    currentStep: 'advisor_review',
    doctorCertificate: {
      uploaded: false,
      verified: false,
    },
    advisorReview: {
      reviewed: false,
      approvedCourses: [],
    },
    deferral: {
      deferred: false,
    },
    createdAt: '2026-06-16T09:30:00Z',
    updatedAt: '2026-06-16T09:30:00Z',
  },
]);

const activeStudentId = ref<string>('stu-current');
const activeStudentName = ref<string>('当前学员');

export function useHealthRisk() {
  const currentRiskRecord = computed<HealthRiskRecord | null>(() => {
    return healthRiskRecords.value.find(r => r.studentId === activeStudentId.value) || null;
  });

  const isRiskBlocked = computed(() => {
    const record = currentRiskRecord.value;
    if (!record) return false;
    return record.status !== 'approved' && record.status !== 'pending';
  });

  const lockedSteps = computed(() => {
    const record = currentRiskRecord.value;
    if (!record || record.status === 'approved' || record.status === 'pending') {
      return [];
    }
    return ['dates', 'instructor', 'equipment', 'confirm'];
  });

  const pendingReviews = computed(() => {
    return healthRiskRecords.value.filter(
      r => r.status === 'needs_doctor_cert' || r.status === 'advisor_review'
    );
  });

  const getWarningDeclarations = (record: HealthRiskRecord): HealthDeclaration[] => {
    return healthDeclarations.filter(h => record.warningItems.includes(h.id));
  };

  const createRiskRecord = (
    answers: HealthDeclarationAnswers,
    warningItems: HealthDeclaration[]
  ): HealthRiskRecord => {
    const now = new Date().toISOString();
    const warningIds = warningItems.map(w => w.id);
    
    const needsDoctorCert = warningItems.some(
      w => w.category === 'heart' || w.category === 'asthma' || w.category === 'neurology' || w.category === 'pregnancy'
    );

    const newRecord: HealthRiskRecord = {
      id: 'hr-' + Date.now(),
      studentId: activeStudentId.value,
      studentName: answers.signatureName || activeStudentName.value,
      declarationAnswers: { ...answers.answers },
      warningItems: warningIds,
      status: needsDoctorCert ? 'needs_doctor_cert' : 'advisor_review',
      currentStep: needsDoctorCert ? 'doctor_certificate' : 'advisor_review',
      doctorCertificate: {
        uploaded: false,
        verified: false,
      },
      advisorReview: {
        reviewed: false,
        approvedCourses: [],
      },
      deferral: {
        deferred: false,
      },
      createdAt: now,
      updatedAt: now,
    };

    const existingIdx = healthRiskRecords.value.findIndex(r => r.studentId === activeStudentId.value);
    if (existingIdx >= 0) {
      healthRiskRecords.value[existingIdx] = newRecord;
    } else {
      healthRiskRecords.value.push(newRecord);
    }

    return newRecord;
  };

  const updateRiskRecord = (recordId: string, updates: Partial<HealthRiskRecord>) => {
    const idx = healthRiskRecords.value.findIndex(r => r.id === recordId);
    if (idx >= 0) {
      healthRiskRecords.value[idx] = {
        ...healthRiskRecords.value[idx],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
    }
  };

  const uploadDoctorCertificate = (recordId: string, fileName: string) => {
    const idx = healthRiskRecords.value.findIndex(r => r.id === recordId);
    if (idx >= 0) {
      const record = healthRiskRecords.value[idx];
      healthRiskRecords.value[idx] = {
        ...record,
        status: 'advisor_review',
        currentStep: 'advisor_review',
        doctorCertificate: {
          uploaded: true,
          fileName,
          verified: false,
        },
        updatedAt: new Date().toISOString(),
      };
    }
  };

  const verifyDoctorCertificate = (recordId: string, verified: boolean, reviewerName: string) => {
    const idx = healthRiskRecords.value.findIndex(r => r.id === recordId);
    if (idx >= 0) {
      const record = healthRiskRecords.value[idx];
      healthRiskRecords.value[idx] = {
        ...record,
        doctorCertificate: {
          ...record.doctorCertificate,
          verified,
          verifiedBy: reviewerName,
          verifiedAt: new Date().toISOString(),
        },
        updatedAt: new Date().toISOString(),
      };
    }
  };

  const advisorApprove = (
    recordId: string,
    reviewerName: string,
    approvedCourses: CourseLevel[],
    notes?: string
  ) => {
    const idx = healthRiskRecords.value.findIndex(r => r.id === recordId);
    if (idx >= 0) {
      const now = new Date().toISOString();
      healthRiskRecords.value[idx] = {
        ...healthRiskRecords.value[idx],
        status: 'approved',
        currentStep: null,
        advisorReview: {
          reviewed: true,
          reviewerName,
          reviewedAt: now,
          notes,
          approvedCourses,
        },
        confirmedAt: now,
        updatedAt: now,
      };
    }
  };

  const advisorReject = (recordId: string, reviewerName: string, reason: string) => {
    const idx = healthRiskRecords.value.findIndex(r => r.id === recordId);
    if (idx >= 0) {
      healthRiskRecords.value[idx] = {
        ...healthRiskRecords.value[idx],
        status: 'rejected',
        currentStep: null,
        advisorReview: {
          reviewed: true,
          reviewerName,
          reviewedAt: new Date().toISOString(),
          notes: reason,
          approvedCourses: [],
        },
        updatedAt: new Date().toISOString(),
      };
    }
  };

  const deferRegistration = (
    recordId: string,
    reviewerName: string,
    reason: string,
    deferredUntil?: string
  ) => {
    const idx = healthRiskRecords.value.findIndex(r => r.id === recordId);
    if (idx >= 0) {
      healthRiskRecords.value[idx] = {
        ...healthRiskRecords.value[idx],
        status: 'deferred',
        currentStep: 'defer_reason',
        deferral: {
          deferred: true,
          reason,
          deferredUntil,
          deferredBy: reviewerName,
        },
        updatedAt: new Date().toISOString(),
      };
    }
  };

  const setActiveStudent = (studentId: string, studentName: string) => {
    activeStudentId.value = studentId;
    activeStudentName.value = studentName;
  };

  const getStatusInfo = (status: HealthRiskStatus) => {
    switch (status) {
      case 'pending':
        return { label: '待提交', color: 'text-ocean-300', bg: 'bg-ocean-500/20', dot: 'bg-ocean-400' };
      case 'needs_doctor_cert':
        return { label: '需医生证明', color: 'text-sand-300', bg: 'bg-sand-500/20', dot: 'bg-sand-400' };
      case 'advisor_review':
        return { label: '顾问复核中', color: 'text-coral-300', bg: 'bg-coral-500/20', dot: 'bg-coral-400' };
      case 'approved':
        return { label: '已通过', color: 'text-kelp-300', bg: 'bg-kelp-500/20', dot: 'bg-kelp-400' };
      case 'rejected':
        return { label: '已拒绝', color: 'text-coral-400', bg: 'bg-coral-500/20', dot: 'bg-coral-400' };
      case 'deferred':
        return { label: '已暂缓', color: 'text-sand-400', bg: 'bg-sand-500/20', dot: 'bg-sand-400' };
      default:
        return { label: '未知', color: 'text-ocean-400', bg: 'bg-ocean-500/20', dot: 'bg-ocean-400' };
    }
  };

  const getStepInfo = (step: HealthRiskStep) => {
    switch (step) {
      case 'doctor_certificate':
        return { label: '提交医生证明', desc: '请上传医生签字的体检证明' };
      case 'advisor_review':
        return { label: '顾问复核', desc: '等待潜水顾问评估健康风险' };
      case 'course_options':
        return { label: '可选课程', desc: '顾问确认适合您的课程' };
      case 'defer_reason':
        return { label: '暂缓原因', desc: '说明暂缓报名的原因' };
      default:
        return { label: '未知步骤', desc: '' };
    }
  };

  return {
    healthRiskRecords,
    currentRiskRecord,
    isRiskBlocked,
    lockedSteps,
    pendingReviews,
    activeStudentId,
    activeStudentName,
    getWarningDeclarations,
    createRiskRecord,
    updateRiskRecord,
    uploadDoctorCertificate,
    verifyDoctorCertificate,
    advisorApprove,
    advisorReject,
    deferRegistration,
    setActiveStudent,
    getStatusInfo,
    getStepInfo,
  };
}
